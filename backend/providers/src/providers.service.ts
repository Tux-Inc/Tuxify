/*
File Name: providers.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: The ProvidersService class is responsible for managing providers,
             including retrieving provider information for a user, updating or
             creating provider tokens, refreshing tokens, adding new providers,
             and handling provider callbacks.
Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { Repository } from 'typeorm';
import { lastValueFrom, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProvider } from './dtos/add-provider.dto';
import { AddedProvider } from './dtos/added-provider.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProviderEntity } from './entities/provider.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AddProviderCallback } from './dtos/add-provider-callback.dto';
import { ProviderRequestTokens } from './dtos/provider-request-tokens.dto';
import { ActionReactionService } from './dtos/action-reaction-service.dto';
import { LocalUserProviderTokens } from './events/local-user-provider-tokens.event';

/* The `ProvidersService` class is responsible for managing providers, including
retrieving provider information for a user, updating or creating provider
tokens, refreshing tokens, adding new providers, and handling provider
callbacks. */
@Injectable()
export class ProvidersService {
  private readonly logger: Logger = new Logger(ProvidersService.name);

  /**
   * The constructor function initializes the providersRepository and natsClient
   * variables.
   * @param providersRepository - The `providersRepository` parameter is an
   * instance of the `Repository` class from the TypeORM library. It is used to
   * interact with the database and perform CRUD operations on the
   * `ProviderEntity` table.
   * @param {ClientProxy} natsClient - The `natsClient` parameter is an instance
   * of the `ClientProxy` class, which is used to communicate with a NATS server.
   * It is injected using the `@Inject('NATS_CLIENT')` decorator, which means that
   * the value of `NATS_CLIENT` is provided by the
   */
  constructor(
    @InjectRepository(ProviderEntity)
    private providersRepository: Repository<ProviderEntity>,
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  /**
   * The function retrieves the providers associated with a user and returns an
   * array of provider information, indicating whether each provider is connected
   * or not.
   * @param {number} userId - The user ID is a number that identifies a specific
   * user. It is used to retrieve the providers associated with that user.
   * @param {ActionReactionService[]} availableProviders - An array of objects
   * representing available providers. Each object has the following properties:
   * @returns an array of ActionReactionService objects.
   */
  async getProvidersForUser(
    userId: number,
    availableProviders: ActionReactionService[],
  ): Promise<ActionReactionService[]> {
    const userProviders: ProviderEntity[] = await this.providersRepository.find(
      { where: { userId } },
    );
    const userProvidersInfos: ActionReactionService[] = [];
    for (const availableProvider of availableProviders) {
      const userProvider: ProviderEntity = userProviders.find(
        (userProvider) => userProvider.provider === availableProvider.name,
      );
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

  /**
   * The function updates or creates a provider entity for a user with the given
   * local user provider tokens.
   * @param {LocalUserProviderTokens} localUserProviderTokens - An object
   * containing the following properties:
   * @returns a Promise that resolves to void.
   */
  async updateOrCreate(
    localUserProviderTokens: LocalUserProviderTokens,
  ): Promise<void> {
    const { provider, userId, accessToken, refreshToken } =
      localUserProviderTokens;
    const existingProvider: ProviderEntity =
      await this.providersRepository.findOne({
        where: {
          provider,
          userId,
        },
      });
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

  /**
   * The function `getTokens` retrieves tokens for a specific provider and user,
   * and refreshes the tokens if they are found.
   * @param {ProviderRequestTokens} providerRequestedTokens - An object that
   * contains the requested tokens for a provider and user. It has two properties:
   * @returns a Promise that resolves to a ProviderEntity object.
   */
  async getTokens(
    providerRequestedTokens: ProviderRequestTokens,
  ): Promise<ProviderEntity> {
    const { provider, userId } = providerRequestedTokens;
    const tokens: ProviderEntity = await this.providersRepository.findOne({
      where: { provider, userId },
    });
    if (!tokens) {
      this.logger.error(
        `No tokens found for provider ${provider} and user ${userId}`,
      );
      throw new RpcException(
        `No tokens found for provider ${provider} and user ${userId}`,
      );
    }
    return await this.refreshTokens(tokens);
  }

  /**
   * The function `getAllTokens` retrieves provider entities from a repository,
   * refreshes their tokens, and returns the refreshed entities after a delay of
   * 10 seconds.
   * @param {string} provider - The `provider` parameter is a string that
   * represents the name or identifier of the provider for which you want to
   * retrieve tokens.
   * @returns the array `userProviderEntitiesWithRefreshedTokens`.
   */
  async getAllTokens(provider: string): Promise<ProviderEntity[]> {
    const userProviderEntities: ProviderEntity[] =
      await this.providersRepository.find({ where: { provider } });
    const userProviderEntitiesWithRefreshedTokens: ProviderEntity[] = [];
    for (const userProviderEntity of userProviderEntities) {
      userProviderEntitiesWithRefreshedTokens.push(
        await this.refreshTokens(userProviderEntity),
      );
    }
    setTimeout(() => {
      return userProviderEntitiesWithRefreshedTokens;
    }, 10000);
    return userProviderEntitiesWithRefreshedTokens;
  }

  /**
   * The function `refreshTokens` refreshes access and refresh tokens for a given
   * provider and user, and returns the updated provider entity.
   * @param {ProviderEntity} providerEntity - The `providerEntity` parameter is an
   * object that represents a provider entity. It contains information about the
   * provider and the user associated with it.
   * @returns a Promise that resolves to a ProviderEntity object.
   */
  private async refreshTokens(
    providerEntity: ProviderEntity,
  ): Promise<ProviderEntity> {
    this.logger.log(
      `Refreshing tokens for provider ${providerEntity.provider} and user ${providerEntity.userId}`,
    );
    const newEntity = await lastValueFrom(
      this.natsClient.send(
        `provider.${providerEntity.provider}.refresh`,
        providerEntity,
      ),
    );
    if (!newEntity || !newEntity.accessToken || !newEntity.refreshToken) {
      this.logger.error(
        `Error while refreshing tokens for provider ${providerEntity.provider} and user ${providerEntity.userId}`,
      );
      this.logger.log(
        `Removing provider ${providerEntity.provider} for user ${providerEntity.userId}`,
      );
      await this.providersRepository.delete({ id: providerEntity.id });
      throw new RpcException(
        `Error while refreshing tokens for provider ${providerEntity.provider} and user ${providerEntity.userId}`,
      );
    }
    this.logger.log(
      `Tokens refreshed for provider ${providerEntity.provider} and user ${providerEntity.userId}`,
    );
    return await this.providersRepository.save(newEntity);
  }

  /**
   * The function `addProvider` sends a request to add a provider and returns a
   * promise that resolves to a string.
   * @param {AddProvider} addProvider - The `addProvider` parameter is an object
   * of type `AddProvider`. It contains the following properties:
   * @returns The function `addProvider` returns a Promise that resolves to a
   * string.
   */
  async addProvider(addProvider: AddProvider): Promise<string> {
    this.logger.log(`Requesting adding ${addProvider.provider} provider`);
    try {
      const responseObservable: Observable<string> = this.natsClient.send(
        `provider.${addProvider.provider}.add`,
        addProvider,
      );
      return await lastValueFrom(responseObservable);
    } catch (err) {
      this.logger.error(err);
      throw new RpcException(
        `Provider ${addProvider.provider} is not available`,
      );
    }
  }

  /**
   * The `addProviderCallback` function sends a request to add a provider
   * callback, updates the user's provider tokens, and emits a success callback to
   * the provider.
   * @param {AddProviderCallback} addProviderCallback - The parameter
   * `addProviderCallback` is an object that contains the following properties:
   * @returns the value of the environment variable
   * `NESTSV_PROVIDERS_CALLBACK_REDIRECT`.
   */
  async addProviderCallback(
    addProviderCallback: AddProviderCallback,
  ): Promise<string> {
    const newProviderObservable: Observable<any> = this.natsClient.send(
      `provider.${addProviderCallback.provider}.add.callback`,
      addProviderCallback,
    );
    newProviderObservable.subscribe({
      next: async (addedProvider: AddedProvider) => {
        const localUserProviderTokens: LocalUserProviderTokens = {
          provider: addProviderCallback.provider,
          userId: addedProvider.userId,
          accessToken: addedProvider.accessToken,
          refreshToken: addedProvider.refreshToken,
        };
        await this.updateOrCreate(localUserProviderTokens);
        this.logger.log(
          `Provider ${addProviderCallback.provider} added for user ${addedProvider.userId}`,
        );
        this.logger.log(
          `Sending success callback to ${addProviderCallback.provider} provider`,
        );
        this.natsClient.emit(
          `provider.${addProviderCallback.provider}.add.callback.success`,
          addedProvider,
        );
      },
      error: (err): void => {},
      complete: (): void => {},
    });
    return process.env.NESTSV_PROVIDERS_CALLBACK_REDIRECT;
  }
}
