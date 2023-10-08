import {BadGatewayException, Inject, Injectable, Logger} from '@nestjs/common';
import {LocalUserProviderTokens} from "./events/local-user-provider-tokens.event";
import {InjectRepository} from "@nestjs/typeorm";
import {ProviderEntity} from "./entities/provider.entity";
import {Repository} from "typeorm";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {AddedProvider} from "./dtos/added-provider.dto";
import {AddProviderCallback} from "./dtos/add-provider-callback.dto";
import {Observable, lastValueFrom, toArray} from "rxjs";
import {AddProvider} from "./dtos/add-provider.dto";

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
        const providersObservable = this.natsClient.send('provider.whoami', {});
        try {
            const providers: string[] = await providersObservable.pipe(
                toArray()
            ).toPromise();
            this.logger.log(`Available providers: ${providers}`);
            return providers;
        } catch (err) {
            throw new RpcException(err);
        }
    }

    async addProvider(addProvider: AddProvider): Promise<string> {
        this.logger.log(`Requesting adding ${addProvider.provider} provider`);
        return lastValueFrom(this.natsClient.send(`provider.${addProvider.provider}.add`, addProvider));
    }

    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<string> {
        const newProviderObservable: Observable<any> = this.natsClient.send(`provider.${addProviderCallback.provider}.add.callback`, addProviderCallback);
        newProviderObservable.subscribe({
            next: (addedProvider: AddedProvider) => {
                this.updateOrCreate({
                    provider: addProviderCallback.provider,
                    userId: addedProvider.userId,
                    accessToken: addedProvider.accessToken,
                    refreshToken: addedProvider.refreshToken,
                });
            },
            error: (err) => {
                throw new RpcException(err);
            },
            complete: () => {
                this.logger.log(`Provider ${addProviderCallback.provider} added`);
            }
        });
        return process.env.NESTSV_PROVIDERS_CALLBACK_REDIRECT;
    }
}
