/*
File Name: auth.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for auth module
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

import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AddProvider } from './dtos/add-provider.dto';
import { AddProviderCallback } from './dtos/add-provider-callback.dto';
import { AddedProvider } from './dtos/added-provider.dto';
import { ProviderEntity } from './dtos/provider.dto';

/* The AuthController class handles authentication-related requests and
communicates with the AuthService to perform the necessary operations. */
@Controller('auth')
export class AuthController {
  /**
   * The constructor function takes an instance of the AuthService class as a
   * parameter and assigns it to the private readonly authService property.
   * @param {AuthService} authService - The `authService` parameter is of type
   * `AuthService` and is marked as `private` and `readonly`. This means that it
   * is a private property of the class and cannot be modified once it is assigned
   * a value. The `AuthService` is likely a service or class that handles
   * authentication-related functionality
   */
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('provider.github.add')
  /**
   * The addProvider function is an asynchronous function that takes an
   * AddProvider payload and returns a Promise that resolves to a string or void.
   * @param {AddProvider} addProvider - The `addProvider` parameter is of type
   * `AddProvider`, which is the payload containing the information needed to add
   * a provider.
   * @returns The `addProvider` method is returning a `Promise` that resolves to a
   * `string` or `void`.
   */
  async addProvider(
    @Payload() addProvider: AddProvider,
  ): Promise<string | void> {
    try {
      return await this.authService.addProvider(addProvider);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern('provider.github.add.callback')
  /**
   * The function `addProviderCallback` is an asynchronous function that calls the
   * `addProviderCallback` method of the `authService` and returns the result, or
   * throws an error if one occurs.
   * @param {AddProviderCallback} addProviderCallback - The addProviderCallback
   * parameter is of type AddProviderCallback, which is an object containing the
   * necessary information for adding a provider callback.
   * @returns a Promise that resolves to an object of type AddedProvider.
   */
  async addProviderCallback(
    addProviderCallback: AddProviderCallback,
  ): Promise<AddedProvider> {
    try {
      return await this.authService.addProviderCallback(addProviderCallback);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern('provider.github.refresh')
  /**
   * The function `refreshTokens` is an asynchronous function that takes a
   * `providerEntity` payload and calls the `refreshTokens` method of the
   * `authService` to refresh the tokens, and returns the updated
   * `providerEntity`.
   * @param {ProviderEntity} providerEntity - The parameter `providerEntity` is an
   * object of type `ProviderEntity`. It is passed as a payload to the
   * `refreshTokens` function.
   * @returns a Promise that resolves to a ProviderEntity object.
   */
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
