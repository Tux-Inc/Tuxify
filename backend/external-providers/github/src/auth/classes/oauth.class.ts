/*
File Name: oauth.class.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Class for oauth

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

import * as process from 'process';
import { randomBytes } from 'crypto';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthorizationCode } from 'simple-oauth2';
import { RpcException } from '@nestjs/microservices';
import { ProviderEntity } from '../dtos/provider.dto';
import { IClient } from '../interfaces/client.interface';
import { AddedProvider } from '../dtos/added-provider.dto';
import { IProvider } from '../interfaces/provider.interface';
import { IAuthParams } from '../interfaces/auth-params.interface';

/* The `OAuthClass` is a TypeScript class that handles OAuth authentication with
GitHub and provides methods for generating authorization URLs, exchanging
authorization codes for access tokens, and refreshing tokens. */
export class OAuthClass {
  public readonly logger: Logger = new Logger(OAuthClass.name);
  private static readonly authProviderEndpoints: IProvider = {
    authorizeHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
  };

  private static readonly scopes: string[] = [
    'user:email',
    'read:user',
    'repo',
    'repo:status',
    'repo_deployment',
    'public_repo',
    'repo:invite',
    'security_events',
  ];

  private readonly refreshTokensPath: string =
    'https://github.com/login/oauth/access_token';
  private readonly infoTokensPath: string = 'https://api.github.com/user';

  private readonly code: AuthorizationCode;
  private readonly authorization: IAuthParams;

  /**
   * The constructor initializes the necessary properties for OAuth authorization.
   * @param {IClient} client - The `client` parameter is of type `IClient` and is
   * used to represent the client making the request. It could contain information
   * such as the client ID and client secret.
   * @param {string} url - The `url` parameter is a string that represents the URL
   * of the endpoint you want to make requests to. It could be the base URL of an
   * API or a specific endpoint URL.
   * @param {number} userId - The `userId` parameter is the unique identifier for
   * the user. It is used to identify the user for whom the authorization is being
   * generated.
   * @param {HttpService} httpService - The `httpService` parameter is an instance
   * of the `HttpService` class. It is used to make HTTP requests to the server.
   */
  constructor(
    private readonly client: IClient,
    private readonly url: string,
    private readonly userId: number,
    private readonly httpService: HttpService,
  ) {
    this.code = new AuthorizationCode({
      client,
      auth: OAuthClass.authProviderEndpoints,
    });
    this.authorization = OAuthClass.genAuthorization(url, userId);
  }

  /**
   * The function returns the state of the authorization.
   * @returns The state property of the authorization object.
   */
  public get state(): string {
    return this.authorization.state;
  }

  /**
   * The function returns the authorization URL for the given authorization code.
   * @returns The authorization URL as a string.
   */
  public get authorizationUrl(): string {
    return this.code.authorizeURL(this.authorization);
  }

  /**
   * The function generates authorization parameters for a GitHub OAuth
   * authentication flow.
   * @param {string} url - The `url` parameter is a string that represents the
   * base URL of your application. It is used to construct the `redirect_uri`
   * parameter, which is the URL that the user will be redirected to after they
   * authorize the application.
   * @param {number} userId - The `userId` parameter is the unique identifier of
   * the user for whom the authorization is being generated. It is used to create
   * a unique state value for the authorization process.
   * @returns an object of type `IAuthParams`.
   */
  private static genAuthorization(url: string, userId: number): IAuthParams {
    const redirect_uri: string = `${url}/providers/github/callback`;
    const state: string = `${randomBytes(16).toString('hex')}-${userId}`;
    return {
      state,
      redirect_uri,
      scope: OAuthClass.scopes,
    };
  }

  /**
   * The function `getToken` takes a code and state as input, retrieves a token
   * using the code, and returns an object containing the access token, refresh
   * token, and user ID.
   * @param {string} code - The "code" parameter is a string that represents the
   * authorization code obtained from the authorization server. This code is used
   * to exchange for an access token.
   * @param {string} state - The "state" parameter is a string that is used to
   * maintain the state of the application during the authorization process. It is
   * typically used to prevent cross-site request forgery (CSRF) attacks. The
   * value of the "state" parameter is usually generated by the application and
   * included in the authorization request
   * @returns an object of type `AddedProvider` with the properties `accessToken`,
   * `refreshToken`, and `userId`.
   */
  public async getToken(code: string, state: string): Promise<AddedProvider> {
    const result = await this.code.getToken({
      code,
      redirect_uri: this.authorization.redirect_uri,
      scope: this.authorization.scope,
    });
    const userId: number = this.getUserIdFromState(state);
    return {
      accessToken: result.token.access_token as string,
      refreshToken: result.token.refresh_token as string,
      userId,
    };
  }

  /**
   * The function refreshes access and refresh tokens for a provider entity using
   * an HTTP POST request.
   * @param {ProviderEntity} providerEntity - The `providerEntity` parameter is an
   * object of type `ProviderEntity`. It contains information about the provider,
   * such as access token, refresh token, and other relevant data.
   * @returns a Promise that resolves to a ProviderEntity object.
   */
  public async refreshTokens(
    providerEntity: ProviderEntity,
  ): Promise<ProviderEntity> {
    const response = await this.httpService
      .post(
        `${this.refreshTokensPath}?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}&refresh_token=${providerEntity.refreshToken}&grant_type=refresh_token`,
      )
      .toPromise();
    if (response.data.includes('error')) {
      return null;
    }
    const responseArray: string[] = response.data.split('&');
    const accessToken: string = responseArray[0].split('=')[1];
    const refreshToken: string = responseArray[2].split('=')[1];
    providerEntity.accessToken = accessToken;
    providerEntity.refreshToken = refreshToken;
    return providerEntity;
  }

  /**
   * The function takes a string and returns the last element of the string after
   * splitting it by '-' and converting it to a number.
   * @param {string} state - The `state` parameter is a string that represents a
   * state.
   * @returns a number, which is the last element of the decodedState array.
   */
  private getUserIdFromState(state: string): number {
    const decodedState: string[] = state.split('-');
    return Number(decodedState[decodedState.length - 1]);
  }
}
