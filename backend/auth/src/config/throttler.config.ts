/*
File Name: throttler.config.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Configuration file for Throttler

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
    ThrottlerModuleOptions,
    ThrottlerOptionsFactory,
} from "@nestjs/throttler";
import { RedisOptions } from "ioredis";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";

/* The ThrottlerConfig class is responsible for creating the
ThrottlerModuleOptions based on the configuration settings provided by the
ConfigService. */
@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
    /**
     * The constructor function takes a ConfigService parameter and assigns it to
     * the configService property.
     * @param {ConfigService} configService - The `configService` parameter is of
     * type `ConfigService` and is marked as `private` and `readonly`. This means
     * that it is a private property of the class and cannot be modified once it
     * is set in the constructor. The `ConfigService` is likely a service or class
     * that provides
     */
    constructor(private readonly configService: ConfigService) {}

    /**
     * The function returns a ThrottlerModuleOptions object based on the
     * configuration settings, with an optional Redis storage if testing is
     * enabled.
     * @returns The function `createThrottlerOptions()` returns an object of type
     * `ThrottlerModuleOptions`.
     */
    createThrottlerOptions(): ThrottlerModuleOptions {
        return this.configService.get<boolean>("testing")
            ? this.configService.get<ThrottlerModuleOptions>("throttler")
            : {
                  ...this.configService.get<ThrottlerModuleOptions>(
                      "throttler",
                  ),
                  storage: new ThrottlerStorageRedisService(
                      this.configService.get<RedisOptions>("redis"),
                  ),
              };
    }
}
