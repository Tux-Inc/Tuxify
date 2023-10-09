import {Controller, Inject, Logger} from '@nestjs/common';
import {GoogleService} from './google.service';
import {ClientProxy, MessagePattern} from "@nestjs/microservices";
import {ProviderInfos} from "./dtos/provider-infos.dto";
@Controller()
export class GoogleController {
    public readonly logger: Logger = new Logger(GoogleController.name);
    constructor(
        private readonly googleService: GoogleService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    @MessagePattern('provider.infos')
    async getProviderInfos(): Promise<ProviderInfos> {
        return this.googleService.getProviderInfos();
    }
}
