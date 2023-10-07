import {Body, Controller, Post} from '@nestjs/common';
import {GatewayService} from "./gateway.service";
import {CreatedUserDto} from "./created-user.dto";

@Controller()
export class GatewayController {
    constructor(
        private readonly gatewayService: GatewayService,
    ) {}

    @Post()
    sendEmail(@Body() createdUserDto: CreatedUserDto) {
        this.gatewayService.sendEmail(createdUserDto);
    }
}
