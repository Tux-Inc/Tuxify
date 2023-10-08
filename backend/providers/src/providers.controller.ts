import {Controller} from '@nestjs/common';
import {ProvidersService} from './providers.service';
import {Ctx, EventPattern, MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {AddProvider} from "./dtos/add-provider.dto";

@Controller()
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {
    }

    @EventPattern('oauth2.user.connected')
    async findOneOrCreate(@Payload() localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
        return await this.providersService.updateOrCreate(localUserProviderTokens);
    }

    @MessagePattern('providers')
    async getAllAvailableProviders(): Promise<string[]> {
        return await this.providersService.getAllAvailableProviders();
    }

    @MessagePattern('providers.*.add')
    async addProvider(@Payload() addProvider: AddProvider): Promise<string> {
        try {
            return await this.providersService.addProvider(addProvider);
        } catch (e) {
            throw new RpcException(e);
        }
    }

    @MessagePattern('providers.*.add.callback')
    async addProviderCallback(@Payload() addProviderCallback: AddProviderCallback): Promise<string> {
        try {
            return await this.providersService.addProviderCallback(addProviderCallback);
        } catch (e) {
            throw new RpcException(e);
        }
    }
}
