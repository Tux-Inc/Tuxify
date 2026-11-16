/*
File Name: providers.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for providers file
Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    Inject,
    Logger,
    NotFoundException,
    Param,
    PipeTransform,
    Post,
    Query,
    Req,
    Res,
    ServiceUnavailableException,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import {
    ActionReactionService,
    AddProvider,
    AddProviderCallback,
    isProviderName,
    isWebhookScope,
    ProviderName,
    safeEqual,
} from "@tuxify/common";
import { AuthGuard } from "../guards/auth.guard";
import { CallbackQueryDto } from "./dto/callback-query.dto";
import {
    callbackPath,
    checkLinkState,
    createLinkState,
    isLinkStateConfigured,
    LINK_STATE_COOKIE,
    LINK_STATE_TTL_SECONDS,
    readCookie,
} from "./link-state/link-state";

/** Rejects any provider that is not registered, before it reaches a NATS subject. */
class ProviderPipe implements PipeTransform<string, ProviderName> {
    transform(value: string): ProviderName {
        if (!isProviderName(value)) throw new NotFoundException("Unknown provider");
        return value;
    }
}

/** Microsoft Graph sends this token once when a subscription is created and expects it back. */
const MAX_VALIDATION_TOKEN_LENGTH = 1024;

@Controller("providers")
export class ProvidersController {
    private readonly logger: Logger = new Logger(ProvidersController.name);

    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    @Get("infos")
    async getAllAvailableProviders(): Promise<ActionReactionService[]> {
        return await lastValueFrom(this.natsClient.send("infos.providers", {}));
    }

    @UseGuards(AuthGuard)
    @Get()
    async getProvidersForUser(
        @Req() req: any,
    ): Promise<ActionReactionService[]> {
        return await lastValueFrom(this.natsClient.send("providers", req.user));
    }

    /**
     * Starts linking a provider account: returns the provider authorisation URL.
     * The OAuth state is created here and also set as an httpOnly cookie, which the
     * frontend must accept (credentials: "include").
     */
    @UseGuards(AuthGuard)
    @Get(":provider/add")
    async addProvider(
        @Param("provider", ProviderPipe) provider: ProviderName,
        @Req() req: any,
        @Res({ passthrough: true }) res: any,
    ): Promise<string> {
        if (!isLinkStateConfigured()) {
            this.logger.warn("PROVIDER_STATE_SECRET is not set: provider linking is disabled");
            throw new ServiceUnavailableException("Provider linking is not configured");
        }
        const state = createLinkState(req.user);
        res.cookie(LINK_STATE_COOKIE, state, {
            httpOnly: true,
            sameSite: "lax",
            secure: req.secure,
            path: callbackPath(provider),
            maxAge: LINK_STATE_TTL_SECONDS * 1000,
        });
        const addProvider: AddProvider = { provider, userId: req.user, state };
        return await lastValueFrom(
            this.natsClient.send(`providers.${provider}.add`, addProvider),
        );
    }

    /**
     * OAuth callback of provider linking. The user id comes from the state, which
     * must be validly signed, unexpired, and equal to the cookie set by /add in the
     * same browser.
     */
    @Get(":provider/callback")
    async addProviderCallback(
        @Param("provider", ProviderPipe) provider: ProviderName,
        @Query() cbQuery: CallbackQueryDto,
        @Req() req: any,
        @Res() res: any,
    ): Promise<void> {
        const cookie = readCookie(req.headers.cookie, LINK_STATE_COOKIE);
        res.clearCookie(LINK_STATE_COOKIE, { path: callbackPath(provider) });
        const userId = checkLinkState(cbQuery.state, cookie);
        if (userId === null) {
            throw new ForbiddenException("Invalid or expired linking request, please try again");
        }
        const addProviderCallback: AddProviderCallback = {
            provider,
            code: cbQuery.code,
            state: cbQuery.state,
            userId,
        };
        const redirectUrl: string = await lastValueFrom(
            this.natsClient.send(
                `providers.${provider}.add.callback`,
                addProviderCallback,
            ),
        );
        res.redirect(redirectUrl);
    }

    /**
     * Webhooks of the providers (Gmail Pub/Sub push, Microsoft Graph notifications).
     * Only whitelisted provider/scope pairs are accepted, each one authenticated:
     * - google: `?token=` must equal GMAIL_PUSH_TOKEN;
     * - microsoft: the subscription validation handshake is answered here, and every
     *   notification carries a signed clientState checked by the Microsoft service.
     * The event is forwarded asynchronously and acknowledged right away (Microsoft
     * Graph expects an answer within 3 seconds).
     */
    @Throttle({ default: { limit: 600, ttl: 60000 } })
    @Post(":provider/action/:scope")
    @HttpCode(202)
    async action(
        @Param("provider", ProviderPipe) provider: ProviderName,
        @Param("scope") scope: string,
        @Query() query: Record<string, string | undefined>,
        @Body() body: unknown,
        @Res({ passthrough: true }) res: any,
    ): Promise<string | void> {
        if (!isWebhookScope(provider, scope)) {
            throw new NotFoundException("Unknown webhook");
        }

        if (provider === "microsoft" && typeof query.validationToken === "string") {
            const token = query.validationToken.slice(0, MAX_VALIDATION_TOKEN_LENGTH);
            res.status(200).type("text/plain");
            return token;
        }

        if (provider === "google") {
            const expected = process.env.GMAIL_PUSH_TOKEN;
            if (!expected) {
                this.logger.warn("GMAIL_PUSH_TOKEN is not set: Gmail push notifications are rejected");
            }
            if (!expected || !safeEqual(query.token, expected)) {
                throw new UnauthorizedException();
            }
        }

        this.natsClient.emit(`provider.${provider}.action.${scope}`, body);
    }
}
