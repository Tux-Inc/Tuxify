import {BadGatewayException, Inject, Injectable, Logger} from '@nestjs/common';
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";
import {InjectRepository} from "@nestjs/typeorm";
import {ProviderEntity} from "./entities/provider.entity";
import {Repository} from "typeorm";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {AddedProvider} from "./dtos/added-provider.dto";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {Observable} from "rxjs";

@Injectable()
export class ProvidersService {
    private readonly logger = new Logger(ProvidersService.name);
    constructor(
        @InjectRepository(ProviderEntity)
        private providersRepository: Repository<ProviderEntity>,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    async updateOrCreate(localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
        const {provider, userId, accessToken, refreshToken} = localUserProviderTokens;
        const existingProvider: ProviderEntity = await this.providersRepository.findOne({where: {provider, userId}});
        if (existingProvider) {
            existingProvider.accessToken = accessToken;
            existingProvider.refreshToken = refreshToken;
            await this.providersRepository.save(existingProvider);
            this.logger.log(`Provider ${provider} updated for user ${userId}`);
            return;
        }
        const newProvider: ProviderEntity = new ProviderEntity();
        newProvider.provider = provider;
        newProvider.userId = userId;
        newProvider.accessToken = accessToken;
        newProvider.refreshToken = refreshToken;
        await this.providersRepository.save(newProvider);
        this.logger.log(`New provider ${provider} added for user ${userId}`);
    }

    async findOneByProviderAndUserId(provider: string, userId: number): Promise<ProviderEntity> {
        return await this.providersRepository.findOne({where: {provider, userId}});
    }

    async getAllAvailableProviders(): Promise<string[]> {
        let providers: string[] = [];
        const providersObservable = this.natsClient.send('providers.whoami', {});
        providersObservable.subscribe({
            next: (data: string) => {
                providers.push(...data);
            },
            complete: () => {
                return providers;
            },
            error: (err) => {
                throw new RpcException(err);
            }
        })
        return providers;
    }

    async addProvider(provider: string): Promise<string | void> {
        const newProviderObservable = this.natsClient.send(`providers.${provider}.add`, {});
        newProviderObservable.subscribe({
            next: (redirectUrl: string) => {
                return redirectUrl;
            }
        });
    }

    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<string | void> {
        const newProviderObservable: Observable<any> = this.natsClient.send(`providers.${addProviderCallback.provider}.add.callback`, addProviderCallback);
        newProviderObservable.subscribe({
            next: (addedProvider: AddedProvider) => {
                this.updateOrCreate({
                    provider: addProviderCallback.provider,
                    userId: addProviderCallback.userId,
                    accessToken: addedProvider.accessToken,
                    refreshToken: addedProvider.refreshToken,
                });
                return process.env.NESTSV_PROVIDERS_CALLBACK_REDIRECT;
            }
        });
    }
}
