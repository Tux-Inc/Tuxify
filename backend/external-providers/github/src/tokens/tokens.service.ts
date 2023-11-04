/*
File Name: tokens.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for tokens management
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

import { lastValueFrom } from 'rxjs';
import { ProviderEntity } from '../auth/dtos/provider.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserProviderTokens } from './dtos/user-provider-tokens.dto';
import { ProviderRequestTokens } from './dtos/provider-request-tokens.dto';

/* The TokensService class is an Injectable service that provides methods for
retrieving user tokens and all tokens from a provider. */
@Injectable()
export class TokensService {
  public readonly logger: Logger = new Logger(TokensService.name);
  /**
   * The constructor function takes in a client proxy object for the NATS
   * messaging system.
   * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
   * `ClientProxy` and is being injected using the `@Inject` decorator. It is
   * likely a client for the NATS messaging system, which allows for communication
   * between microservices in a distributed system.
   */
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  /**
   * The function `getTokens` retrieves user provider tokens for a specific user
   * from the GitHub provider.
   * @param {number} userId - The `userId` parameter is a number that represents
   * the unique identifier of a user.
   * @returns a Promise that resolves to an object of type UserProviderTokens.
   */
  public async getTokens(userId: number): Promise<UserProviderTokens> {
    try {
      const providerRequestTokens: ProviderRequestTokens = {
        provider: 'github',
        userId,
      };
      return lastValueFrom<UserProviderTokens>(
        this.natsClient.send(
          'providers.github.getTokens',
          providerRequestTokens,
        ),
      );
    } catch (err) {
      throw new RpcException(err);
    }
  }

  /**
   * The function `getAllTokens` retrieves all tokens for a specific provider from
   * a NATS client.
   * @returns a Promise that resolves to an array of ProviderEntity objects.
   */
  public async getAllTokens(): Promise<ProviderEntity[]> {
    try {
      const usersProviderTokensObservable = this.natsClient.send(
        'providers.github.getAllTokens',
        'github',
      );
      return lastValueFrom<ProviderEntity[]>(usersProviderTokensObservable);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
