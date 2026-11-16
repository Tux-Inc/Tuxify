/*
File Name: auth.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for authentication with Github OAuth2.0
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

import { HttpService } from '@nestjs/axios';
import { OAuthClass } from './classes/oauth.class';
import { Injectable, Logger } from '@nestjs/common';
import { AddProvider, AddProviderCallback, AddedProvider, IClient, ProviderEntity } from '@tuxify/common';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(public readonly httpService: HttpService) {}

  /** Authorisation URL for the OAuth state created by the gateway. */
  async addProvider(addProvider: AddProvider): Promise<string> {
    if (!addProvider.state) throw new RpcException('Missing OAuth state');
    this.logger.log('Sending authentication URL to client');
    return this.oauth().authorizationUrl(addProvider.state);
  }

  /** The gateway has verified the state: the user comes from the callback message. */
  async addProviderCallback(
    addProviderCallback: AddProviderCallback,
  ): Promise<AddedProvider> {
    this.logger.log('Callback received from Github');
    const { code, userId } = addProviderCallback;
    if (!code || !Number.isSafeInteger(userId)) {
      throw new RpcException('Invalid Github callback');
    }
    const tokensUser: AddedProvider = await this.oauth().getToken(code, userId);
    this.logger.log(`Tokens received from Github for user ${tokensUser.userId}`);
    return tokensUser;
  }

  async refreshTokens(
    providerEntity: ProviderEntity,
  ): Promise<ProviderEntity> {
    return await this.oauth().refreshTokens(providerEntity);
  }

  /** A new instance per call, so that no OAuth data is shared between users. */
  private oauth(): OAuthClass {
    const client: IClient = {
      id: process.env.GH_CLIENT_ID,
      secret: process.env.GH_CLIENT_SECRET,
    };
    return new OAuthClass(client, process.env.API_BASE_URL, this.httpService);
  }
}
