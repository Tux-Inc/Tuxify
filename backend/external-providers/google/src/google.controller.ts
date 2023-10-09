import {Controller, Inject, Logger, Res} from '@nestjs/common';
import {GoogleService} from './google.service';
import {ClientProxy, MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {ProviderInfos} from "./dtos/provider-infos.dto";
import {toArray} from "rxjs";
import {ActionInfos} from "./dtos/action-infos.dto";
import {TriggerInfos} from "./dtos/trigger-infos.dto";
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
