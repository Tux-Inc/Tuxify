/*
File Name: auth.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Auth service for Auth service logic and routes definition
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

import { HttpService } from "@nestjs/axios";
import { OAuthClass } from "./classes/oauth.class";
import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { ProviderEntity } from "./dtos/provider.dto";
import { AddProvider } from "./dtos/add-provider.dto";
import { IClient } from "./interfaces/client.interface";
import { AddedProvider } from "./dtos/added-provider.dto";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";

/* The AuthService class is responsible for handling authentication and
authorization using OAuth2 with Google as the provider. */
@Injectable()
export class AuthService {
    private google: OAuthClass | null;
    private readonly logger: Logger = new Logger(AuthService.name);

    /**
     * The constructor function takes an HttpService parameter and assigns it to
     * the httpService property.
     * @param {HttpService} httpService - The `httpService` parameter is of type
     * `HttpService` and is marked as `public` and `readonly`. This means that it
     * is a public property of the class and cannot be modified once it is
     * assigned a value. The `HttpService` is likely a service or class that
     * provides functionality
     */
    constructor(public readonly httpService: HttpService) {}

    /**
     * The function sends an authentication URL to the client and returns the
     * authorization URL.
     * @param {AddProvider} addProvider - The `addProvider` parameter is an object
     * that contains the necessary information to add a provider. It likely
     * includes properties such as `userId`, which represents the user for whom
     * the provider is being added.
     * @returns a Promise that resolves to a string.
     */
    async addProvider(addProvider: AddProvider): Promise<string> {
        this.logger.log("Sending authentication URL to client");
        this.google = AuthService.setOAuthClass(
            process.env.API_BASE_URL,
            addProvider.userId,
            this.httpService,
        );
        return this.getAuthorizationUrl();
    }

    /**
     * The function `addProviderCallback` receives a callback from Google,
     * extracts the code and state parameters, retrieves an access token using
     * these parameters, and returns the access token.
     * @param {AddProviderCallback} addProviderCallback - The addProviderCallback
     * parameter is an object that contains the callback information received from
     * Google. It typically includes properties such as "code" and "state", which
     * are used to retrieve access tokens for the user.
     * @returns a Promise that resolves to an object of type AddedProvider.
     */
    async addProviderCallback(
        addProviderCallback: AddProviderCallback,
    ): Promise<AddedProvider> {
        this.logger.log("Callback received from Google");
        const { code, state } = addProviderCallback;
        const tokensUser: AddedProvider = await this.getAccessToken(
            code,
            state,
        );
        this.logger.log(
            `Tokens received from Google for user ${tokensUser.userId}`,
        );
        return tokensUser;
    }

    /**
     * The function refreshes the access token and returns the updated provider
     * entity.
     * @param {ProviderEntity} providerEntity - An object that represents a
     * provider entity, which likely contains information such as the user ID and
     * refresh token for a specific provider.
     * @returns a Promise that resolves to a ProviderEntity object.
     */
    async refreshTokens(
        providerEntity: ProviderEntity,
    ): Promise<ProviderEntity> {
        const { refreshToken } = providerEntity;
        this.google = AuthService.setOAuthClass(
            process.env.API_BASE_URL,
            providerEntity.userId,
            this.httpService,
        );
        return await this.google.refreshTokens(providerEntity);
    }

    /**
     * The function sets up and returns an instance of the OAuthClass using the
     * provided parameters.
     * @param {string} url - The `url` parameter is a string that represents the
     * URL of the OAuth server or endpoint that you want to connect to. This could
     * be the authorization server URL or the token endpoint URL, depending on the
     * OAuth flow you are implementing.
     * @param {number} userId - The `userId` parameter is the unique identifier
     * for the user who is initiating the OAuth process.
     * @param {HttpService} httpService - The `httpService` parameter is an
     * instance of the `HttpService` class, which is responsible for making HTTP
     * requests. It is used by the `OAuthClass` to send requests to the OAuth
     * server for authentication and authorization.
     * @returns an instance of the OAuthClass or null.
     */
    private static setOAuthClass(
        url: string,
        userId: number,
        httpService: HttpService,
    ): OAuthClass | null {
        const client: IClient = {
            id: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
        };
        return new OAuthClass(client, url, userId, httpService);
    }

    /**
     * The function returns the authorization URL for OAuth.
     * @returns The method is returning the authorization URL as a string.
     */
    public getAuthorizationUrl(): string {
        return this.getOAuth().authorizationUrl;
    }

    /**
     * The function returns the Google OAuth2 instance if it is configured,
     * otherwise it throws an error.
     * @returns The `getOAuth()` method is returning an instance of the
     * `OAuthClass` class.
     */
    private getOAuth(): OAuthClass {
        if (!this.google) throw new Error("Google OAuth2 is not configured");
        return this.google;
    }

    /**
     * The function `getAccessToken` is a private asynchronous function that takes
     * in a code and state as parameters, and returns a Promise of type
     * `AddedProvider`.
     * @param {string} code - The "code" parameter is a string that represents the
     * authorization code obtained from the OAuth provider. This code is used to
     * exchange for an access token.
     * @param {string} state - The "state" parameter is a unique value generated
     * by the client application and included in the authorization request. It is
     * used to prevent cross-site request forgery attacks by ensuring that the
     * authorization response matches the initial request.
     * @returns a Promise that resolves to an object of type "AddedProvider".
     */
    private async getAccessToken(
        code: string,
        state: string,
    ): Promise<AddedProvider> {
        const oauth: OAuthClass = this.getOAuth();
        if (state !== oauth.state) throw new RpcException("Corrupted state");
        return oauth.getToken(code, state);
    }
}
