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

import { Injectable, Logger } from "@nestjs/common";
import { AddProvider } from "./dtos/add-provider.dto";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";
import { AddedProvider } from "./dtos/added-provider.dto";
import { ProviderEntity } from "./dtos/provider.dto";
import { IProvider } from "./interfaces/provider.interface";
import { randomBytes } from "crypto";
import { RpcException } from "@nestjs/microservices";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AuthService {
    private readonly logger: Logger = new Logger(AuthService.name);
    private static readonly authProviderEndpoints: IProvider = {
        authorizeHost: 'https://login.microsoftonline.com',
        authorizePath: '/common/oauth2/v2.0/authorize',
        tokenHost: 'https://login.microsoftonline.com',
        tokenPath: '/common/oauth2/v2.0/token',
    };

    private static readonly scopes: string[] = [
        'openid',
        'profile',
        'offline_access',
        'User.Read',
        'Mail.Read',
        'Mail.ReadWrite',
        'Mail.Send',
        'Calendars.Read',
        'Calendars.ReadWrite',
        'Calendars.Read.Shared',
        'Calendars.ReadWrite.Shared',
        'Contacts.Read',
        'Contacts.ReadWrite',
        'Notes.Read',
        'Notes.ReadWrite',
        'Tasks.Read',
        'Tasks.ReadWrite',
    ];

    constructor(
        private readonly httpService: HttpService,
    ) {
    }

    private static genState(userId: number): string {
        return `${randomBytes(16).toString('hex')}.${userId}`;
    }

    private async getTokens(code: string, state: string): Promise<AddedProvider> {
        if (!code || !state)
            throw new RpcException("Invalid code or state received from Microsoft");
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
            const { data } = await this.httpService.post(
                `${AuthService.authProviderEndpoints.tokenHost}${AuthService.authProviderEndpoints.tokenPath}`,
                body,
                { headers }).toPromise();
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

    async addProvider(addProvider: AddProvider): Promise<string> {
        this.logger.log('Sending authentication URL to client');
        const url = `${AuthService.authProviderEndpoints.authorizeHost}${AuthService.authProviderEndpoints.authorizePath}`;
        const params = {
            client_id: process.env.MICROSOFT_CLIENT_ID,
            response_type: 'code',
            redirect_uri: `${process.env.API_BASE_URL}/providers/microsoft/callback`,
            scope: AuthService.scopes.join(' '),
            state: AuthService.genState(addProvider.userId),
        };
        const queryParams = new URLSearchParams(params).toString();
        return `${url}?${queryParams}`;
    }

    async addProviderCallback(addProviderCallback: AddProviderCallback): Promise<AddedProvider> {
        this.logger.log('Callback received from Microsoft');
        const { code, state } = addProviderCallback;
        const tokensUser: AddedProvider = await this.getTokens(code, state);
        this.logger.log(`Tokens received from Microsoft for user ${tokensUser.userId}`);
        return tokensUser;
    }

    async refreshTokens(providerEntity: ProviderEntity): Promise<ProviderEntity> {
        const params = {
            client_id: process.env.MICROSOFT_CLIENT_ID,
            client_secret: process.env.MICROSOFT_CLIENT_SECRET,
            refresh_token: providerEntity.refreshToken,
            grant_type: 'refresh_token',
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const body = new URLSearchParams(params).toString();
        return this.httpService.post(
            `${AuthService.authProviderEndpoints.tokenHost}${AuthService.authProviderEndpoints.tokenPath}`,
            body,
            { headers },
        ).toPromise().then(({ data }) => {
            const { access_token, refresh_token } = data;
            return {
                ...providerEntity,
                accessToken: access_token,
                refreshToken: refresh_token,
            };
        }).catch(e => {
            throw new RpcException(e.message);
        });
    }
}
