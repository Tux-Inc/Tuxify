/*
 * File Name: auth.service.ts
 * Author: neptos
 * Creation Date: 2023
 *
 * Copyright (c) 2023 Tux Inc. (backend)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { randomBytes } from "crypto";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ProviderEntity } from "./dtos/provider.dto";
import { RpcException } from "@nestjs/microservices";
import { AddProvider } from "./dtos/add-provider.dto";
import { AddedProvider } from "./dtos/added-provider.dto";
import { IProvider } from "./interfaces/provider.interface";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";

/* The AuthService class is responsible for handling authentication and
authorization with Microsoft services. */
@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);
    private static readonly authProviderEndpoints: IProvider = {
        authorizeHost: "https://login.microsoftonline.com",
        authorizePath: "/common/oauth2/v2.0/authorize",
        tokenHost: "https://login.microsoftonline.com",
        tokenPath: "/common/oauth2/v2.0/token",
    };

    private static readonly scopes: string[] = [
        "openid",
        "profile",
        "offline_access",
        "User.Read",
        "Mail.Read",
        "Mail.ReadWrite",
        "Mail.Send",
        "Calendars.Read",
        "Calendars.ReadWrite",
        "Calendars.Read.Shared",
        "Calendars.ReadWrite.Shared",
        "Contacts.Read",
        "Contacts.ReadWrite",
        "Notes.Read",
        "Notes.ReadWrite",
        "Tasks.Read",
        "Tasks.ReadWrite",
    ];

    /**
     * The constructor function takes in an HttpService instance as a parameter
     * and assigns it to the private readonly httpService property.
     * @param {HttpService} httpService - The `httpService` parameter is of type
     * `HttpService` and is marked as `private` and `readonly`. This means that it
     * can only be accessed within the class and its value cannot be changed once
     * it is assigned.
     */
    constructor(private readonly httpService: HttpService) {}

    /**
     * The function `genState` generates a unique state string by concatenating a
     * random hexadecimal string with a user ID.
     * @param {number} userId - The `userId` parameter is of type `number` and
     * represents the unique identifier of a user.
     * @returns a string that consists of two parts separated by a period. The
     * first part is a randomly generated 16-byte string encoded in hexadecimal
     * format, and the second part is the userId passed as a parameter to the
     * function.
     */
    private static genState(userId: number): string {
        return `${randomBytes(16).toString("hex")}.${userId}`;
    }

    /**
     * The function `getTokens` is an asynchronous function that takes in a code
     * and state as parameters, and returns a Promise that resolves to an object
     * containing the userId, accessToken, and refreshToken.
     * @param {string} code - The code parameter is a string that represents the
     * authorization code received from Microsoft after the user has successfully
     * authenticated and authorized the application.
     * @param {string} state - The `state` parameter is a string that is generated
     * by the client and passed to the server during the authorization process. It
     * is used to maintain the state of the user's session and prevent cross-site
     * request forgery attacks. In this code, the `state` parameter is expected to
     * be in the
     * @returns an object of type `AddedProvider` with the properties `userId`,
     * `accessToken`, and `refreshToken`.
     */
    private async getTokens(
        code: string,
        state: string,
    ): Promise<AddedProvider> {
        if (!code || !state)
            throw new RpcException(
                "Invalid code or state received from Microsoft",
            );
        const [nonce, userId] = state.split(".");
        if (!nonce || !userId)
            throw new RpcException("Invalid state received from Microsoft");
        const params = {
            client_id: process.env.MICROSOFT_CLIENT_ID,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.API_BASE_URL}/providers/microsoft/callback`,
            grant_type: "authorization_code",
        };
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        const body = new URLSearchParams(params).toString();
        try {
            const { data } = await this.httpService
                .post(
                    `${AuthService.authProviderEndpoints.tokenHost}${AuthService.authProviderEndpoints.tokenPath}`,
                    body,
                    { headers },
                )
                .toPromise();
            const { access_token, refresh_token } = data;
            return {
                userId: parseInt(userId),
                accessToken: access_token,
                refreshToken: refresh_token,
            };
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

    /**
     * The function generates an authentication URL for a Microsoft provider and
     * returns it to the client.
     * @param {AddProvider} addProvider - The `addProvider` parameter is an object
     * that contains information about the provider being added. It likely
     * includes properties such as `userId`, which represents the user for whom
     * the provider is being added.
     * @returns a string that represents the authentication URL.
     */
    async addProvider(addProvider: AddProvider): Promise<string> {
        this.logger.log("Sending authentication URL to client");
        const url = `${AuthService.authProviderEndpoints.authorizeHost}${AuthService.authProviderEndpoints.authorizePath}`;
        const params = {
            client_id: process.env.MICROSOFT_CLIENT_ID,
            response_type: "code",
            redirect_uri: `${process.env.API_BASE_URL}/providers/microsoft/callback`,
            scope: AuthService.scopes.join(" "),
            state: AuthService.genState(addProvider.userId),
        };
        const queryParams = new URLSearchParams(params).toString();
        return `${url}?${queryParams}`;
    }

    /**
     * The function `addProviderCallback` receives a callback from Microsoft,
     * extracts the code and state parameters, retrieves tokens using these
     * parameters, and returns the tokens for the user.
     * @param {AddProviderCallback} addProviderCallback - The addProviderCallback
     * parameter is an object that contains the callback information received from
     * Microsoft. It typically includes properties such as code and state, which
     * are used to retrieve tokens from Microsoft.
     * @returns a Promise that resolves to an object of type AddedProvider.
     */
    async addProviderCallback(
        addProviderCallback: AddProviderCallback,
    ): Promise<AddedProvider> {
        this.logger.log("Callback received from Microsoft");
        const { code, state } = addProviderCallback;
        const tokensUser: AddedProvider = await this.getTokens(code, state);
        this.logger.log(
            `Tokens received from Microsoft for user ${tokensUser.userId}`,
        );
        return tokensUser;
    }

    /**
     * The function `refreshTokens` is an asynchronous function that takes a
     * `ProviderEntity` as a parameter and returns a promise that resolves to a
     * modified `ProviderEntity` with updated access and refresh tokens.
     * @param {ProviderEntity} providerEntity - The `providerEntity` parameter is
     * an object that represents the provider entity. It contains properties such
     * as `refreshToken`, `accessToken`, and other relevant information related to
     * the provider.
     * @returns a Promise that resolves to a ProviderEntity object.
     */
    async refreshTokens(
        providerEntity: ProviderEntity,
    ): Promise<ProviderEntity> {
        const params = {
            client_id: process.env.MICROSOFT_CLIENT_ID,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET,
            refresh_token: providerEntity.refreshToken,
            grant_type: "refresh_token",
        };
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        const body = new URLSearchParams(params).toString();
        return this.httpService
            .post(
                `${AuthService.authProviderEndpoints.tokenHost}${AuthService.authProviderEndpoints.tokenPath}`,
                body,
                { headers },
            )
            .toPromise()
            .then(({ data }) => {
                const { access_token, refresh_token } = data;
                return {
                    ...providerEntity,
                    accessToken: access_token,
                    refreshToken: refresh_token,
                };
            })
            .catch((e) => {
                throw new RpcException(e.message);
            });
    }
}
