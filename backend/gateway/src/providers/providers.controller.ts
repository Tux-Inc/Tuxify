import {BadGatewayException, Controller, Get, Inject, Param, Query, Req, Res, UseGuards} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {CallbackQueryDto} from "./dto/callback-query.dto";
import {AddProviderCallback} from "./dto/add-provider-callback.dto";
import {AuthGuard} from "../guards/auth.guard";

@Controller('providers')
export class ProvidersController {
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    @UseGuards(AuthGuard)
    @Get(':provider')
    async addProvider(@Param('provider') provider: string, @Res() res: any): Promise<void> {
        this.natsClient.send(`providers.${provider}.add`, provider).subscribe({
            next: (data) => {
                res.redirect(data);
            },
            error: (err) => {
                throw new BadGatewayException(err);
            }
        })
    }

    @UseGuards(AuthGuard)
    @Get(':provider/callback')
    async addProviderCallback(@Param('provider') provider: string, @Res() res: any, @Query() cbQuery: CallbackQueryDto, @Req() req: any): Promise<void> {
        const addProviderCallback: AddProviderCallback = {
            provider,
            code: cbQuery.code,
            state: cbQuery.state,
            userId: req.user.userId,
        }
        this.natsClient.send(`providers.${provider}.add.callback`, addProviderCallback).subscribe({
            next: (data) => {
                res.redirect(data);
            },
            error: (err) => {
                throw new BadGatewayException(err);
            }
        })
    }
}
