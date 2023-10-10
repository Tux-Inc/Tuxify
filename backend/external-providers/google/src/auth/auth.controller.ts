import {Controller} from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {AddProvider} from "./dtos/add-provider.dto";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {AddedProvider} from "./dtos/added-provider.dto";
import {AuthService} from "./auth.service";
import { ProviderEntity } from "./dtos/provider.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @MessagePattern('provider.google.add')
    async addProvider(@Payload() addProvider: AddProvider): Promise<string | void> {
        try {
            return await this.authService.addProvider(addProvider);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

    @MessagePattern('provider.google.add.callback')
    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<AddedProvider> {
        try {
            return await this.authService.addProviderCallback(addProviderCallback);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

    @MessagePattern('provider.google.refresh')
    async refreshTokens(@Payload() providerEntity: ProviderEntity): Promise<ProviderEntity> {
        try {
            return await this.authService.refreshTokens(providerEntity);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }
}
