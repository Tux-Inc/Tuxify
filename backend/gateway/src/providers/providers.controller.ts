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
    BadGatewayException,
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Logger,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { AddProvider } from "./dto/add-provider.dto";
import { CallbackQueryDto } from "./dto/callback-query.dto";
import { AddProviderCallback } from "./dto/add-provider-callback.dto";
import { ActionReactionService } from "./dto/action-reaction-service.dto";

/* The ProvidersController class is a TypeScript controller that handles requests
related to providers, such as retrieving available providers, adding providers,
and performing actions on providers. */
@Controller("providers")
export class ProvidersController {
    public readonly logger: Logger = new Logger(ProvidersController.name);

    /**
     * The constructor function takes in a client proxy object and injects it as a
     * dependency using the "NATS_CLIENT" token.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is being injected using the `@Inject` decorator. It is
     * likely being used to establish a connection to a NATS server for messaging
     * purposes.
     */
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    @Get("infos")
    /**
     * The function `getAllAvailableProviders` returns a promise that resolves to
     * an array of `ActionReactionService` objects.
     * @returns The function `getAllAvailableProviders` returns a Promise that
     * resolves to an array of `ActionReactionService` objects.
     */
    async getAllAvailableProviders(): Promise<ActionReactionService[]> {
        return await lastValueFrom(this.natsClient.send("infos.providers", {}));
    }

    @UseGuards(AuthGuard)
    @Get()
    /**
     * The function `getProvidersForUser` is an asynchronous function that sends a
     * request to a NATS client to retrieve a list of providers for a user.
     * @param {any} req - The `req` parameter is the request object that contains
     * information about the incoming HTTP request. It is typically provided by
     * the framework or library you are using to handle HTTP requests (e.g.,
     * Express.js, Nest.js). In this case, it seems to be an object that contains
     * the `user`
     * @returns a Promise that resolves to an array of ActionReactionService
     * objects.
     */
    async getProvidersForUser(
        @Req() req: any,
    ): Promise<ActionReactionService[]> {
        try {
            return lastValueFrom(this.natsClient.send("providers", req.user));
        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Get(":provider/add")
    /**
     * The addProvider function in TypeScript is an asynchronous function that
     * adds a provider to a list and sends a message to a NATS client.
     * @param {string} provider - The "provider" parameter is a string that
     * represents the name of the provider being added.
     * @param {any} res - The `res` parameter is the response object that is used
     * to send the response back to the client. It is typically used to send data,
     * set headers, and handle the response status.
     * @param {any} req - The `req` parameter is an object that represents the
     * HTTP request made to the server. It contains information such as the
     * request headers, query parameters, and body of the request.
     */
    async addProvider(
        @Param("provider") provider: string,
        @Res() res: any,
        @Req() req: any,
    ): Promise<any> {
        const addProvider: AddProvider = {
            provider,
            userId: req.user,
        };
        try {
            await lastValueFrom(
                this.natsClient.send(`providers.${provider}.add`, addProvider),
            ).then((data) => {
                res.send(data);
            });
        } catch (e) {
            throw e;
        }
    }

    @Get(":provider/callback")
    async addProviderCallback(
        @Param("provider") provider: string,
        @Res() res: any,
        @Query() cbQuery: CallbackQueryDto,
    ): Promise<void> {
        const addProviderCallback: AddProviderCallback = {
            provider,
            code: cbQuery.code,
            state: cbQuery.state,
        };
        try {
            await lastValueFrom(
                this.natsClient.send(
                    `providers.${provider}.add.callback`,
                    addProviderCallback,
                ),
            ).then((data) => {
                res.redirect(data);
            });
        } catch (e) {
            throw e;
        }
    }

    @Post(":provider/action/:scope")
    @HttpCode(200)
    async action(
        @Param("provider") provider: string,
        @Param("scope") scope: string,
        @Body() body: any,
        @Req() req: any,
        @Res() res: any,
    ): Promise<void> {
        try {
            await firstValueFrom(
                this.natsClient.send(
                    `provider.${provider}.action.${scope}`,
                    body,
                ),
            );
            if (req.query && req.query.validationToken) {
                res.set("Content-Type", "text/plain");
                res.send(req.query.validationToken);
            } else {
                res.send();
            }
        } catch (e) {
            if (req.query && req.query.validationToken) {
                res.set("Content-Type", "text/plain");
                res.send(req.query.validationToken);
            } else {
                res.send();
            }
        }
    }
}
