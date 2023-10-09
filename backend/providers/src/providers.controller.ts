import {Controller} from '@nestjs/common';
import {ProvidersService} from './providers.service';
import {Ctx, EventPattern, MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {AddProvider} from "./dtos/add-provider.dto";
import {UserProviderTokens} from "./dtos/user-provider-tokens.dto";
import {ProviderRequestTokens} from "./dtos/provider-request-tokens.dto";
import {ProviderInfos} from "./dtos/provider-infos.dto";

@Controller()
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {
    }

    @EventPattern('oauth2.user.connected')
    async findOneOrCreate(@Payload() localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
        return await this.providersService.updateOrCreate(localUserProviderTokens);
    }

    @MessagePattern('providers')
    async getAllAvailableProviders(): Promise<ProviderInfos[]> {
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

    @MessagePattern('providers.*.getTokens')
    async getTokens(@Payload() providerRequestTokens: ProviderRequestTokens): Promise<UserProviderTokens> {
        try {
            return await this.providersService.getTokens(providerRequestTokens);
        } catch (e) {
            throw new RpcException(e);
        }
    }
}
