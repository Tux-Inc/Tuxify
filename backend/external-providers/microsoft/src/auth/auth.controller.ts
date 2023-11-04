/*
 * File Name: auth.controller.ts
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

import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ProviderEntity } from "./dtos/provider.dto";
import { AddProvider } from "./dtos/add-provider.dto";
import { AddedProvider } from "./dtos/added-provider.dto";
import { AddProviderCallback } from "./dtos/add-provider-callback.dto";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";

/* The AuthController class handles authentication-related requests and
communicates with the AuthService to perform the necessary operations. */
@Controller("auth")
export class AuthController {
    /**
     * The constructor function takes an instance of the AuthService class as a
     * parameter and assigns it to the private readonly authService property.
     * @param {AuthService} authService - The `authService` parameter is of type
     * `AuthService` and is marked as `private` and `readonly`. This means that it
     * is a private property of the class and cannot be modified once it is
     * assigned a value. The `AuthService` is likely a service or class that
     * handles authentication-related functionality
     */
    constructor(private readonly authService: AuthService) {}

    /* The `@MessagePattern("provider.microsoft.add")` decorator is used to define
    a message pattern for the method `addProvider()` in the `AuthController`
    class. This pattern is used by the NestJS microservices framework to route
    incoming messages to the appropriate method. */
    @MessagePattern("provider.microsoft.add")
    async addProvider(
        @Payload() addProvider: AddProvider,
    ): Promise<string | void> {
        try {
            return await this.authService.addProvider(addProvider);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

    /* The `@MessagePattern("provider.microsoft.add.callback")` decorator is used
    to define a message pattern for the method `addProviderCallback()` in the
    `AuthController` class. This pattern is used by the NestJS microservices
    framework to route incoming messages with the specified pattern to this
    method. */
    @MessagePattern("provider.microsoft.add.callback")
    async addProviderCallback(
        @Payload() addProviderCallback: AddProviderCallback,
    ): Promise<AddedProvider> {
        try {
            return await this.authService.addProviderCallback(
                addProviderCallback,
            );
        } catch (e) {
            throw new RpcException(e.message);
        }
    }

    /* The `@MessagePattern("provider.microsoft.refresh")` decorator is used to
    define a message pattern for the `refreshTokens()` method in the
    `AuthController` class. This pattern is used by the NestJS microservices
    framework to route incoming messages with the specified pattern to this
    method. */
    @MessagePattern("provider.microsoft.refresh")
    async refreshTokens(
        @Payload() providerEntity: ProviderEntity,
    ): Promise<ProviderEntity> {
        try {
            return await this.authService.refreshTokens(providerEntity);
        } catch (e) {
            throw new RpcException(e.message);
        }
    }
}
