import {Controller, Res} from '@nestjs/common';
import {GoogleService} from './google.service';
import {MessagePattern, Payload, RpcException} from "@nestjs/microservices";
@Controller()
export class GoogleController {
    constructor(
        private readonly googleService: GoogleService,
    ) {
    }

    @MessagePattern('provider.whoami')
    async sendIdentity(): Promise<string> {
        return 'google';
    }
}
