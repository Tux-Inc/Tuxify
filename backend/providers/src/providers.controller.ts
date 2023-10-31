import { Controller } from "@nestjs/common";
import { ProvidersService } from "./providers.service";
import { EventPattern, MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";
import { AddProvider } from "./dtos/add-provider.dto";
import { UserProviderTokens } from "./dtos/user-provider-tokens.dto";
import { ProviderRequestTokens } from "./dtos/provider-request-tokens.dto";
import { ProviderEntity } from "./entities/provider.entity";
import { ActionReactionService } from "./dtos/action-reaction-service.dto";

// import { LocalUserProviderTokens } from "./events/local-user-provider-tokens.event";

@Controller()
export class ProvidersController {
    public availableProviders: ActionReactionService[] = [];

    constructor(private readonly providersService: ProvidersService) {
    }

    // While we still use the OAuth2 module from auth,
    // we don't automatically assign the newly connected user as a liked user of the provider (e.g. Google)
    // because, auth & provider can have different scopes
    // (e.g. Google has a scope for Gmail and a scope for Google Calendar, but auth only has a scope for profiles information).
    // TODO: Make OAuth2 communicate with providers to add the newly connected user as a liked user of the provider.

    // @EventPattern("oauth2.user.connected")
    // async findOneOrCreate(@Payload() localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
    //     return await this.providersService.updateOrCreate(localUserProviderTokens);
    // }

    @EventPattern("heartbeat.providers.*")
    setProvidersInfos(@Payload() providerInfos: ActionReactionService): void {
        const providerName: string = providerInfos.name;
        this.availableProviders = this.availableProviders.filter(availableProvider => availableProvider.name !== providerName);
        this.availableProviders.push(providerInfos);
    }


    @MessagePattern("infos.providers")
    getAllAvailableProviders(): ActionReactionService[] {
        return this.availableProviders;
    }

    @MessagePattern("providers")
    async getProvidersForUser(@Payload() userId: number): Promise<ActionReactionService[]> {
        try {
            return await this.providersService.getProvidersForUser(userId, this.availableProviders);
        } catch (e) {
            throw new RpcException(e);
        }
    }

    @MessagePattern("providers.*.add")
    async addProvider(@Payload() addProvider: AddProvider): Promise<string> {
        try {
            return await this.providersService.addProvider(addProvider);
        } catch (e) {
            throw new RpcException(e);
        }
    }

    @MessagePattern("providers.*.add.callback")
    async addProviderCallback(@Payload() addProviderCallback: AddProviderCallback): Promise<string> {
        try {
            return await this.providersService.addProviderCallback(addProviderCallback);
        } catch (e) {
            throw new RpcException(e);
        }
    }

    @MessagePattern("providers.*.getTokens")
    async getTokens(@Payload() providerRequestTokens: ProviderRequestTokens): Promise<UserProviderTokens> {
        try {
            return await this.providersService.getTokens(providerRequestTokens);
        } catch (e) {
            throw new RpcException(e);
        }
    }

    @MessagePattern("providers.*.getAllTokens")
    async getAllTokens(@Payload() provider: string): Promise<ProviderEntity[]> {
        try {
            return await this.providersService.getAllTokens(provider);
        } catch (e) {
            throw new RpcException(e);
        }
    }
}
