import {Controller} from '@nestjs/common';
import {ProvidersService} from './providers.service';
import {Ctx, EventPattern, MessagePattern, Payload} from "@nestjs/microservices";
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";

@Controller()
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {
    }

    @EventPattern('oauth2.user.connected')
    async findOneOrCreate(@Payload() localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
        return await this.providersService.updateOrCreate(localUserProviderTokens);
    }

    @MessagePattern('providers.*.add')
    async addProvider(@Payload() provider: string): Promise<string | void> {
        return await this.providersService.addProvider(provider);
    }

    @MessagePattern('providers.*.add.callback')
    async addProviderCallback(@Payload() addProviderCallback: AddProviderCallback): Promise<string | void> {
        return await this.providersService.addProviderCallback(addProviderCallback);
    }
}
