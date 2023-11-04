/*
File Name: oauth-flag.guard.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: OAuth flag guard

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

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    mixin,
    NotFoundException,
    Type,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { ConfigService } from "@nestjs/config";
import { IClient } from "../interfaces/client.interface";
import { isNull } from "../../common/utils/validation.util";
import { OAuthProvidersEnum } from "../../users/enums/oauth-providers.enum";

/**
 * The `OAuthFlagGuard` function is a TypeScript function that returns a guard
 * class for checking if a specific OAuth provider is configured.
 * @param {OAuthProvidersEnum} provider - The `provider` parameter is of type
 * `OAuthProvidersEnum`. It is used to specify the OAuth provider for which the
 * guard is being created.
 * @returns a class that implements the `CanActivate` interface.
 */
export const OAuthFlagGuard = (
    provider: OAuthProvidersEnum,
): Type<CanActivate> => {
    /* The `OAuthFlagGuardClass` is a TypeScript class that implements the
    `CanActivate` interface and is used to guard routes based on the presence
    of an OAuth client configuration. */
    @Injectable()
    class OAuthFlagGuardClass implements CanActivate {
        /**
         * The constructor function takes a ConfigService parameter and assigns it
         * to the configService property.
         * @param {ConfigService} configService - The `configService` parameter is
         * of type `ConfigService` and is marked as `private` and `readonly`. This
         * means that it is a private property of the class and cannot be modified
         * once it is set in the constructor. The `ConfigService` is likely a
         * service or class that provides
         */
        constructor(private readonly configService: ConfigService) {}

        /**
         * The canActivate function checks if a client is null and throws a
         * NotFoundException if it is, otherwise it returns true.
         * @param {ExecutionContext} context - The `context` parameter is an
         * instance of the `ExecutionContext` class. It provides information about
         * the current execution context, such as the type of the current platform
         * (e.g., HTTP, RPC, etc.) and the underlying request and response
         * objects. In this case, it is used to access the
         * @returns a boolean value of `true`.
         */
        public canActivate(context: ExecutionContext): boolean {
            const client = this.configService.get<IClient | null>(
                `oauth2.${provider}`,
            );

            if (isNull(client)) {
                const request = context
                    .switchToHttp()
                    .getRequest<FastifyRequest>();
                throw new NotFoundException(
                    `Cannot ${request.method} ${request.url}`,
                );
            }

            return true;
        }
    }

    return mixin(OAuthFlagGuardClass);
};
