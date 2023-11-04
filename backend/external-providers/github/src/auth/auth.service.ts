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
import { ProviderEntity } from './dtos/provider.dto';
import { RpcException } from '@nestjs/microservices';
import { AddProvider } from './dtos/add-provider.dto';
import { IClient } from './interfaces/client.interface';
import { AddedProvider } from './dtos/added-provider.dto';
import { AddProviderCallback } from './dtos/add-provider-callback.dto';

/* The AuthService class is responsible for handling authentication and
authorization using OAuth with GitHub. */
@Injectable()
export class AuthService {
  private github: OAuthClass | null;
  private readonly logger: Logger = new Logger(AuthService.name);

  /**
   * The constructor function takes an HttpService parameter and assigns it to the
   * httpService property.
   * @param {HttpService} httpService - The `httpService` parameter is of type
   * `HttpService` and is marked as `public` and `readonly`. This means that it is
   * a public property of the class and cannot be modified once it is assigned a
   * value. The `HttpService` is likely a service or class that provides
   * functionality
   */
  constructor(public readonly httpService: HttpService) {}

  /**
   * The function sends an authentication URL to the client and returns the
   * authorization URL.
   * @param {AddProvider} addProvider - The `addProvider` parameter is an object
   * that contains the necessary information to add a provider. It likely includes
   * properties such as `userId`, which represents the user for whom the provider
   * is being added.
   * @returns a Promise that resolves to a string.
   */
  async addProvider(addProvider: AddProvider): Promise<string> {
    this.logger.log('Sending authentication URL to client');
    this.github = AuthService.setOAuthClass(
      process.env.API_BASE_URL,
      addProvider.userId,
      this.httpService,
    );
    return this.getAuthorizationUrl();
  }

  /**
   * The function `addProviderCallback` receives a callback from Github, extracts
   * the code and state, retrieves access tokens using the code and state, and
   * returns the tokens for the user.
   * @param {AddProviderCallback} addProviderCallback - The addProviderCallback
   * parameter is an object that contains the callback information received from
   * Github. It typically includes properties such as code and state, which are
   * used to obtain access tokens.
   * @returns a Promise that resolves to an object of type AddedProvider.
   */
  async addProviderCallback(
    addProviderCallback: AddProviderCallback,
  ): Promise<AddedProvider> {
    this.logger.log('Callback received from Github');
    const { code, state } = addProviderCallback;
    const tokensUser: AddedProvider = await this.getAccessToken(code, state);
    this.logger.log(
      `Tokens received from Github for user ${tokensUser.userId}`,
    );
    return tokensUser;
  }

  /**
   * The function refreshes the access tokens for a provider entity using the
   * GitHub OAuth class.
   * @param {ProviderEntity} providerEntity - An object that represents the
   * provider entity. It contains information such as the user ID and the refresh
   * token.
   * @returns a Promise that resolves to a ProviderEntity object.
   */
  async refreshTokens(providerEntity: ProviderEntity): Promise<ProviderEntity> {
    const { refreshToken } = providerEntity;
    this.github = AuthService.setOAuthClass(
      process.env.API_BASE_URL,
      providerEntity.userId,
      this.httpService,
    );
    return await this.github.refreshTokens(providerEntity);
  }

  /**
   * The function sets up and returns an instance of the OAuthClass using the
   * provided parameters.
   * @param {string} url - The `url` parameter is a string that represents the URL
   * of the OAuth server that you want to connect to.
   * @param {number} userId - The `userId` parameter is the unique identifier for
   * the user. It is typically used to associate the OAuthClass instance with a
   * specific user in the system.
   * @param {HttpService} httpService - The `httpService` parameter is an instance
   * of the `HttpService` class. It is used to make HTTP requests to the specified
   * URL.
   * @returns an instance of the OAuthClass with the provided client, url, userId,
   * and httpService parameters.
   */
  private static setOAuthClass(
    url: string,
    userId: number,
    httpService: HttpService,
  ): OAuthClass | null {
    const client: IClient = {
      id: process.env.GH_CLIENT_ID,
      secret: process.env.GH_CLIENT_SECRET,
    };
    return new OAuthClass(client, url, userId, httpService);
  }

  /**
   * The function returns the authorization URL for OAuth.
   * @returns The authorization URL.
   */
  public getAuthorizationUrl(): string {
    return this.getOAuth().authorizationUrl;
  }

  /**
   * The function returns the configured Github OAuth2 instance or throws an error
   * if it is not configured.
   * @returns The `getOAuth()` function is returning an instance of the
   * `OAuthClass` class.
   */
  private getOAuth(): OAuthClass {
    if (!this.github) throw new Error('Github OAuth2 is not configured');
    return this.github;
  }

  /**
   * The function `getAccessToken` is a private asynchronous function that
   * retrieves an access token using a code and state, and returns an
   * `AddedProvider` object.
   * @param {string} code - The "code" parameter is a string that represents the
   * authorization code obtained from the OAuth provider. This code is used to
   * exchange for an access token.
   * @param {string} state - The "state" parameter is a unique value generated by
   * the client application and included in the authorization request. It is used
   * to prevent cross-site request forgery attacks by ensuring that the
   * authorization response matches the initial request.
   * @returns a Promise that resolves to an object of type AddedProvider.
   */
  private async getAccessToken(
    code: string,
    state: string,
  ): Promise<AddedProvider> {
    const oauth: OAuthClass = this.getOAuth();
    if (state !== oauth.state) throw new RpcException('Corrupted state');
    return oauth.getToken(code, state);
  }
}
