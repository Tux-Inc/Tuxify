import {
    BadGatewayException, Body,
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
import { ClientProxy } from "@nestjs/microservices";
import { CallbackQueryDto } from "./dto/callback-query.dto";
import { AddProviderCallback } from "./dto/add-provider-callback.dto";
import { AuthGuard } from "../guards/auth.guard";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { AddProvider } from "./dto/add-provider.dto";
import { ActionReactionService } from "./dto/action-reaction-service.dto";

@Controller('providers')
export class ProvidersController {
    public readonly logger: Logger = new Logger(ProvidersController.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    @Get('infos')
    async getAllAvailableProviders(): Promise<ActionReactionService[]> {
        return await lastValueFrom(this.natsClient.send('infos.providers', {}));
    }

    @UseGuards(AuthGuard)
    @Get()
    async getProvidersForUser(@Req() req: any): Promise<ActionReactionService[]> {
        try {
            return lastValueFrom(this.natsClient.send('providers', req.user))
        } catch (e) {
            throw e;
        }
    }

    @UseGuards(AuthGuard)
    @Get(':provider/add')
    async addProvider(@Param('provider') provider: string, @Res() res: any, @Req() req: any): Promise<any> {
        const addProvider: AddProvider = {
            provider,
            userId: req.user,
        }
        try {
            await lastValueFrom(this.natsClient.send(`providers.${provider}.add`, addProvider)).then((data) => {
                res.send(data);
            })
        } catch (e) {
            throw e;
        }
    }

    @Get(':provider/callback')
    async addProviderCallback(@Param('provider') provider: string, @Res() res: any, @Query() cbQuery: CallbackQueryDto): Promise<void> {
        const addProviderCallback: AddProviderCallback = {
            provider,
            code: cbQuery.code,
            state: cbQuery.state,
        }
        try {
            await lastValueFrom(this.natsClient.send(`providers.${provider}.add.callback`, addProviderCallback)).then((data) => {
                res.redirect(data);
            })
        } catch (e) {
            throw e;
        }
    }

    @Post(':provider/action/:scope')
    @HttpCode(200)
    async action(@Param('provider') provider: string, @Param('scope') scope: string, @Body() body: any): Promise<void> {
        try {
            await firstValueFrom(this.natsClient.send(`provider.${provider}.action.${scope}`, body));
            return;
        } catch (e) {
            return;
        }
    }
}
