import { Inject, Injectable, Logger } from "@nestjs/common";
import { LocalUserProviderTokens } from "./events/local-user-provider-tokens.event";
import { InjectRepository } from "@nestjs/typeorm";
import { ProviderEntity } from "./entities/provider.entity";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { AddedProvider } from "./dtos/added-provider.dto";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";
import { lastValueFrom, Observable, subscribeOn, takeUntil, timer, toArray } from "rxjs";
import { AddProvider } from "./dtos/add-provider.dto";
import { ProviderRequestTokens } from "./dtos/provider-request-tokens.dto";
import { ProviderInfos } from "./dtos/provider-infos.dto";
import { ProviderInfosUser } from "./dtos/provider-infos-user.dtos";

@Injectable()
export class ProvidersService {
    private readonly logger: Logger = new Logger(ProvidersService.name);
    constructor(
        @InjectRepository(ProviderEntity)
        private providersRepository: Repository<ProviderEntity>,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    async getAllAvailableProviders(): Promise<ProviderInfos[]> {
        const providersObservable: Observable<ProviderInfos> = this.natsClient.send('provider.infos', {});

        // Create a notifier that will emit a value after 5 seconds
        const timeoutNotifier = timer(1000000); // adjust the duration as needed

        try {
            const providersArray = providersObservable.pipe(
                takeUntil(timeoutNotifier),
                toArray()
            ).toPromise();
            console.log(providersArray);

            return providersArray;
        } catch (err) {
            this.logger.error(`Error fetching providers: ${err.message}`);
            throw new RpcException(err);
        }
    }

    async getProvidersForUser(userId: number, availableProviders: ProviderInfos[]): Promise<ProviderInfosUser[]> {
        const userProviders: ProviderEntity[] = await this.providersRepository.find({where: {userId}});
        const userProvidersInfos: ProviderInfosUser[] = [];
        for (const availableProvider of availableProviders) {
            const userProvider: ProviderEntity = userProviders.find(userProvider => userProvider.provider === availableProvider.name);
            if (userProvider) {
                userProvidersInfos.push({
                    ...availableProvider,
                    isConnected: true,
                });
            } else {
                userProvidersInfos.push({
                    ...availableProvider,
                    isConnected: false,
                });
            }
        }
        return userProvidersInfos;
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

    async getTokens(providerRequestedTokens: ProviderRequestTokens): Promise<ProviderEntity> {
        const {provider, userId} = providerRequestedTokens;
        const tokens =  await this.providersRepository.findOne({where: {provider, userId}});
        return await this.refreshTokens(tokens);
    }

    async getAllTokens(provider: string): Promise<ProviderEntity[]> {
        const userProviderEntities = await this.providersRepository.find({where: {provider}});
        const userProviderEntitiesWithRefreshedTokens: ProviderEntity[] = [];
        for (const userProviderEntity of userProviderEntities) {
            userProviderEntitiesWithRefreshedTokens.push(await this.refreshTokens(userProviderEntity));
        }
        setTimeout(() => {
            return userProviderEntitiesWithRefreshedTokens;
        }, 10000);
        return userProviderEntitiesWithRefreshedTokens;
    }

    private async refreshTokens(providerEntity: ProviderEntity): Promise<ProviderEntity> {
        const newEntity = await lastValueFrom(this.natsClient.send(`provider.${providerEntity.provider}.refresh`, providerEntity));
        return await this.providersRepository.save(newEntity);
    }

    async addProvider(addProvider: AddProvider): Promise<string> {
        this.logger.log(`Requesting adding ${addProvider.provider} provider`);
        try {
            const responseObservable: Observable<string> = this.natsClient.send(`provider.${addProvider.provider}.add`, addProvider);
            return await lastValueFrom(responseObservable);
        } catch (err) {
            this.logger.error(err);
            throw new RpcException(`Provider ${addProvider.provider} is not available`);
        }
    }

    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<string> {
        const newProviderObservable: Observable<any> = this.natsClient.send(`provider.${addProviderCallback.provider}.add.callback`, addProviderCallback);
        newProviderObservable.subscribe({
            next: (addedProvider: AddedProvider) => {
                const localUserProviderTokens: LocalUserProviderTokens = {
                    provider: addProviderCallback.provider,
                    userId: addedProvider.userId,
                    accessToken: addedProvider.accessToken,
                    refreshToken: addedProvider.refreshToken,
                }
                this.updateOrCreate(localUserProviderTokens);
                this.logger.log(`Provider ${addProviderCallback.provider} added for user ${addedProvider.userId}`);
                this.logger.log(`Sending success callback to ${addProviderCallback.provider} provider`);
                this.natsClient.emit(`provider.${addProviderCallback.provider}.add.callback.success`, addedProvider);
            },
            error: (err) => {
            },
            complete: () => {
            }
        });
        return process.env.NESTSV_PROVIDERS_CALLBACK_REDIRECT;
    }
}
