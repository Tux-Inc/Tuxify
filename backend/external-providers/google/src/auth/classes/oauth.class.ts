/*
File Name: oauth.class.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: OAuth class for OAuth class definition and configuration
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

import { randomBytes } from "crypto";
import { Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AuthorizationCode } from "simple-oauth2";
import { ProviderEntity } from "../dtos/provider.dto";
import { IClient } from "../interfaces/client.interface";
import { AddedProvider } from "../dtos/added-provider.dto";
import { IProvider } from "../interfaces/provider.interface";
import { IAuthParams } from "../interfaces/auth-params.interface";

/* The `OAuthClass` is a TypeScript class that handles OAuth authentication and
token management for Google APIs. */
export class OAuthClass {
    public readonly logger: Logger = new Logger(OAuthClass.name);
    private static readonly authProviderEndpoints: IProvider = {
        authorizeHost: "https://accounts.google.com",
        authorizePath: "/o/oauth2/v2/auth?access_type=offline&",
        tokenHost: "https://www.googleapis.com",
        tokenPath: "/oauth2/v4/token",
    };

    private static readonly scopes: string[] = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.metadata",
        "https://www.googleapis.com/auth/gmail.insert",
        "https://www.googleapis.com/auth/gmail.labels",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
    ];

    private readonly refreshTokensPath: string =
        "https://oauth2.googleapis.com/token";
    private readonly infoTokensPath: string =
        "https://www.googleapis.com/oauth2/v3/tokeninfo";

    private readonly code: AuthorizationCode;
    private readonly authorization: IAuthParams;
    private readonly userDataUrl: string;

    /**
     * The constructor initializes various properties required for OAuth
     * authorization and sets the user data URL.
     * @param {IClient} client - An instance of the IClient interface, which
     * represents the client making the request.
     * @param {string} url - The `url` parameter is a string that represents the
     * URL endpoint for the OAuth authorization process. It is used to redirect
     * the user to the authorization page and receive the authorization code.
     * @param {number} userId - The `userId` parameter is the unique identifier
     * for the user. It is typically used to associate the user with their
     * specific data or actions within the application.
     * @param {HttpService} httpService - The `httpService` parameter is an
     * instance of the `HttpService` class. It is used to make HTTP requests to
     * external APIs.
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
        this.userDataUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    }

    /**
     * The function returns the state property of the authorization object.
     * @returns The state property of the authorization object.
     */
    public get state(): string {
        return this.authorization.state;
    }

    /**
     * The function returns the data URL of the user's data.
     * @returns The `dataUrl` property is being returned as a string.
     */
    public get dataUrl(): string {
        return this.userDataUrl;
    }

    /**
     * The function returns the authorization URL for the given authorization
     * code.
     * @returns The authorization URL is being returned.
     */
    public get authorizationUrl(): string {
        return this.code.authorizeURL(this.authorization);
    }

    /**
     * The function generates authorization parameters for a Google OAuth
     * authentication flow.
     * @param {string} url - The `url` parameter is a string that represents the
     * base URL of your application. It is used to construct the `redirect_uri`
     * parameter, which is the URL where the user will be redirected after they
     * authorize the application.
     * @param {number} userId - The `userId` parameter is the unique identifier of
     * the user for whom the authorization is being generated. It is used to
     * create a unique state value for the authorization process.
     * @returns an object of type `IAuthParams`.
     */
    private static genAuthorization(url: string, userId: number): IAuthParams {
        const redirect_uri: string = `${url}/providers/google/callback`;
        const state: string = `${randomBytes(16).toString("hex")}-${userId}`;
        return {
            state,
            redirect_uri,
            scope: OAuthClass.scopes,
        };
    }

    /**
     * The function `getToken` takes in a code and state, retrieves a token using
     * the code, and returns an object containing the access token, refresh token,
     * and user ID.
     * @param {string} code - The "code" parameter is a string that represents the
     * authorization code obtained from the authorization server. This code is
     * used to exchange for an access token and refresh token.
     * @param {string} state - The "state" parameter is a string that is used to
     * maintain the state of the application during the authorization process. It
     * is typically used to prevent cross-site request forgery (CSRF) attacks. The
     * value of the "state" parameter is usually generated by the application and
     * included in the authorization request
     * @returns an object of type `AddedProvider` with the following properties:
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
     * The function refreshes the access token for a provider entity using the
     * refresh token and returns the updated provider entity.
     * @param {ProviderEntity} providerEntity - The `providerEntity` parameter is
     * an object that represents a provider entity. It likely contains properties
     * such as `refreshToken`, `accessToken`, and other relevant information
     * related to the provider.
     * @returns a Promise that resolves to a ProviderEntity object.
     */
    public async refreshTokens(
        providerEntity: ProviderEntity,
    ): Promise<ProviderEntity> {
        const response = await this.httpService
            .post(this.refreshTokensPath, {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: providerEntity.refreshToken,
                grant_type: "refresh_token",
            })
            .toPromise();

        providerEntity.accessToken = response.data.access_token;
        return providerEntity;
    }

    /**
     * The function `getUserIdFromState` takes a string parameter `state` and
     * returns the last element of the string after splitting it by hyphens and
     * converting it to a number.
     * @param {string} state - The `state` parameter is a string that represents a
     * state.
     * @returns a number, which is the last element of the decodedState array.
     */
    private getUserIdFromState(state: string): number {
        const decodedState: string[] = state.split("-");
        return Number(decodedState[decodedState.length - 1]);
    }
}
