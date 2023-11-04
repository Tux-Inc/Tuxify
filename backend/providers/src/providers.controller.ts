/*
File Name: action-reaction-input.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: The `ActionReactionInput` class represents an input field with properties for
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

import { ProvidersService } from './providers.service';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AddProvider } from './dtos/add-provider.dto';
import { ProviderEntity } from './entities/provider.entity';
import { UserProviderTokens } from './dtos/user-provider-tokens.dto';
import { AddProviderCallback } from './dtos/add-provider-callback.dto';
import { ActionReactionService } from './dtos/action-reaction-service.dto';
import { ProviderRequestTokens } from './dtos/provider-request-tokens.dto';
// import { LocalUserProviderTokens } from "./events/local-user-provider-tokens.event";

/* The `ProvidersController` class is a TypeScript controller that handles
requests related to providers, such as adding a provider, retrieving provider
information, and getting tokens for a provider. */
@Controller()
export class ProvidersController {
  public availableProviders: ActionReactionService[] = [];

  /**
   * The constructor function takes in an instance of the ProvidersService class
   * as a parameter and assigns it to the providersService property.
   * @param {ProvidersService} providersService - The `providersService` parameter
   * is of type `ProvidersService` and is marked as `private` and `readonly`. This
   * means that it is a private property of the class and cannot be modified once
   * it is assigned a value. It is likely that this parameter is used to inject an
   * instance of the
   */
  constructor(private readonly providersService: ProvidersService) {}

  // While we still use the OAuth2 module from auth,
  // we don't automatically assign the newly connected user as a liked user of the provider (e.g. Google)
  // because, auth & provider can have different scopes
  // (e.g. Google has a scope for Gmail and a scope for Google Calendar, but auth only has a scope for profiles information).
  // TODO: Make OAuth2 communicate with providers to add the newly connected user as a liked user of the provider.

  // @EventPattern("oauth2.user.connected")
  // async findOneOrCreate(@Payload() localUserProviderTokens: LocalUserProviderTokens): Promise<void> {
  //     return await this.providersService.updateOrCreate(localUserProviderTokens);
  // }

  @EventPattern('heartbeat.providers.*')
  /**
   * The function updates the availableProviders array by removing the provider
   * with the same name as the providerInfos name and then adding the
   * providerInfos object to the array.
   * @param {ActionReactionService} providerInfos - The `providerInfos` parameter
   * is of type `ActionReactionService`.
   */
  setProvidersInfos(@Payload() providerInfos: ActionReactionService): void {
    const providerName: string = providerInfos.name;
    this.availableProviders = this.availableProviders.filter(
      (availableProvider) => availableProvider.name !== providerName,
    );
    this.availableProviders.push(providerInfos);
  }

  @MessagePattern('infos.providers')
  /**
   * The function returns an array of ActionReactionService objects representing
   * all available providers.
   * @returns The method `getAllAvailableProviders()` is returning an array of
   * `ActionReactionService` objects.
   */
  getAllAvailableProviders(): ActionReactionService[] {
    return this.availableProviders;
  }

  @MessagePattern('providers')
  /**
   * The function `getProvidersForUser` retrieves a list of providers for a given
   * user ID.
   * @param {number} userId - The userId parameter is of type number and
   * represents the unique identifier of a user.
   * @returns a Promise that resolves to an array of ActionReactionService
   * objects.
   */
  async getProvidersForUser(
    @Payload() userId: number,
  ): Promise<ActionReactionService[]> {
    try {
      return await this.providersService.getProvidersForUser(
        userId,
        this.availableProviders,
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @MessagePattern('providers.*.add')
  /**
   * The above function is an asynchronous function that adds a provider using the
   * `addProvider` payload and returns a promise that resolves to a string.
   * @param {AddProvider} addProvider - The `addProvider` parameter is of type
   * `AddProvider`, which is the payload received in the request.
   * @returns a Promise that resolves to a string.
   */
  async addProvider(@Payload() addProvider: AddProvider): Promise<string> {
    try {
      return await this.providersService.addProvider(addProvider);
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @MessagePattern('providers.*.add.callback')
  /**
   * The function `addProviderCallback` is an asynchronous function that takes an
   * `addProviderCallback` payload and returns a promise that resolves to a
   * string.
   * @param {AddProviderCallback} addProviderCallback - The parameter
   * `addProviderCallback` is of type `AddProviderCallback`. It is decorated with
   * `@Payload()` which indicates that the value of the parameter will be
   * extracted from the payload of the incoming request.
   * @returns a Promise that resolves to a string.
   */
  async addProviderCallback(
    @Payload() addProviderCallback: AddProviderCallback,
  ): Promise<string> {
    try {
      return await this.providersService.addProviderCallback(
        addProviderCallback,
      );
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @MessagePattern('providers.*.getTokens')
  /**
   * The function `getTokens` is an asynchronous function that takes in a
   * `providerRequestTokens` object and returns a `UserProviderTokens` object, and
   * it catches any errors and throws an `RpcException` with the error.
   * @param {ProviderRequestTokens} providerRequestTokens - The parameter
   * `providerRequestTokens` is of type `ProviderRequestTokens`. It is an object
   * that contains the necessary information for requesting tokens from a
   * provider.
   * @returns a Promise that resolves to a UserProviderTokens object.
   */
  async getTokens(
    @Payload() providerRequestTokens: ProviderRequestTokens,
  ): Promise<UserProviderTokens> {
    try {
      return await this.providersService.getTokens(providerRequestTokens);
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @MessagePattern('providers.*.getAllTokens')
  /**
   * The function `getAllTokens` is an asynchronous function that takes a
   * `provider` parameter and returns a promise that resolves to an array of
   * `ProviderEntity` objects.
   * @param {string} provider - The `provider` parameter is a string that
   * represents the provider for which you want to retrieve all tokens.
   * @returns a Promise that resolves to an array of ProviderEntity objects.
   */
  async getAllTokens(@Payload() provider: string): Promise<ProviderEntity[]> {
    try {
      return await this.providersService.getAllTokens(provider);
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
