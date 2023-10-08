import {Controller, Res} from '@nestjs/common';
import {GoogleService} from './google.service';
import {MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {AddProvider} from "./dtos/add-provider.dto";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {AddedProvider} from "./dtos/added-provider.dto";

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

    @MessagePattern('provider.google.add')
    async addProvider(@Payload() addProvider: AddProvider): Promise<string | void> {
        try {
            return await this.googleService.addProvider(addProvider);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

    @MessagePattern('provider.google.add.callback')
    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<AddedProvider> {
        try {
            return await this.googleService.addProviderCallback(addProviderCallback);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

}
