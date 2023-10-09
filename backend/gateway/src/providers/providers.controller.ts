import {
    BadGatewayException,
    BadRequestException,
    Controller,
    Get,
    Inject,
    Param,
    Query,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {CallbackQueryDto} from "./dto/callback-query.dto";
import {AddProviderCallback} from "./dto/add-provider-callback.dto";
import {AuthGuard} from "../guards/auth.guard";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {AddProvider} from "./dto/add-provider.dto";

@Controller('providers')
export class ProvidersController {
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    @Get()
    async getAllAvailableProviders(): Promise<string[]> {
        return await lastValueFrom(this.natsClient.send('providers', {}));
    }

    // @UseGuards(AuthGuard)
    @Get(':provider')
    async addProvider(@Param('provider') provider: string, @Res() res: any, @Req() req: any): Promise<void> {
        const addProvider: AddProvider = {
            provider,
            userId: 1, // req.user.userId,
        }
        try {
            await lastValueFrom(this.natsClient.send(`providers.${provider}.add`, addProvider)).then((data) => {
                res.redirect(data);
            })
        } catch (e) {
            throw new BadRequestException(e);
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
            throw new BadGatewayException(e);
        }
    }
}
