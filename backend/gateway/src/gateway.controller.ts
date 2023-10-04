import {Controller, Get, Logger} from '@nestjs/common';
import {GatewayService} from "./gateway.service";

@Controller()
export class GatewayController {
    constructor(
        private readonly gatewayService: GatewayService,
    ) {}

    @Get()
    sendEmail() {
        this.gatewayService.sendEmail({test: "salut"});
    }
}
