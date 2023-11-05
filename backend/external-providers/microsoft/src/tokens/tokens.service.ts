/*
File Name: tokens.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for tokens

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

import { lastValueFrom } from "rxjs";
import { ProviderEntity } from "../auth/dtos/provider.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { UserProviderTokens } from "./dtos/user-provider-tokens.dto";
import { ProviderRequestTokens } from "./dtos/provider-request-tokens.dto";

/* The TokensService class is an Injectable service that handles the retrieval of
user tokens from a Microsoft provider. */
@Injectable()
export class TokensService {
    public readonly logger: Logger = new Logger(TokensService.name);

    /**
     * The constructor function takes in a client proxy object and injects it as a
     * dependency using the "NATS_CLIENT" token.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is being injected using the `@Inject` decorator. It is
     * likely being used to establish a connection to a NATS server for messaging
     * purposes.
     */
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    /**
     * The function `getTokens` retrieves user provider tokens for a specific user
     * from the Microsoft provider.
     * @param {number} userId - The `userId` parameter is a number that represents
     * the unique identifier of a user. It is used to retrieve the tokens for a
     * specific user from a provider.
     * @returns a Promise that resolves to an object of type UserProviderTokens.
     */
    public async getTokens(userId: number): Promise<UserProviderTokens> {
        try {
            const providerRequestTokens: ProviderRequestTokens = {
                provider: "microsoft",
                userId,
            };
            return lastValueFrom<UserProviderTokens>(
                this.natsClient.send(
                    "providers.microsoft.getTokens",
                    providerRequestTokens,
                ),
            );
        } catch (err) {
            throw new RpcException(err);
        }
    }

    /**
     * The function `getAllTokens` retrieves all tokens from the Microsoft
     * provider using NATS messaging.
     * @returns a Promise that resolves to an array of ProviderEntity objects.
     */
    public async getAllTokens(): Promise<ProviderEntity[]> {
        try {
            const usersProviderTokensObservable = this.natsClient.send(
                "providers.microsoft.getAllTokens",
                "microsoft",
            );
            return lastValueFrom<ProviderEntity[]>(
                usersProviderTokensObservable,
            );
        } catch (err) {
            throw new RpcException(err);
        }
    }
}
