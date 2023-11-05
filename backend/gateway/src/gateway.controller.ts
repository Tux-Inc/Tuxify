import {Body, Controller, Get, Inject, Post, Req} from '@nestjs/common';
import {GatewayService} from "./gateway.service";
import {CreatedUserDto} from "./created-user.dto";
import {lastValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";

@Controller()
export class GatewayController {
    constructor(
        private readonly gatewayService: GatewayService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    @Get('/about.json')
    async sendAboutJson(@Req() req: any) {
        return {
            client: {
                host: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            },
            server: {
                current_time: new Date().toISOString(),
                services: await lastValueFrom(this.natsClient.send('infos.providers', {})),
            },
        };
    }


    @Post()
    sendEmail(@Body() createdUserDto: CreatedUserDto) {
        this.gatewayService.sendEmail(createdUserDto);
    }
}
