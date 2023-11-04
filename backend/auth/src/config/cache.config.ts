/*
File Name: cache.config.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Cache configuration file

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

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-ioredis-yet";
import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";

/* The `CacheConfig` class is an Injectable class that implements the
`CacheOptionsFactory` interface and is responsible for creating cache options
based on the configuration provided by the `ConfigService`. */
@Injectable()
export class CacheConfig implements CacheOptionsFactory {
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
     * The function creates cache options based on the configuration settings,
     * including the time-to-live (TTL) for cache entries and the Redis store if
     * testing is not enabled.
     * @returns a Promise that resolves to a `CacheModuleOptions` object.
     */
    async createCacheOptions(): Promise<CacheModuleOptions> {
        const ttl = this.configService.get<number>("jwt.refresh.time") * 1000;

        return this.configService.get<boolean>("testing")
            ? { ttl }
            : {
                  store: await redisStore({
                      ...this.configService.get("redis"),
                      ttl,
                  }),
              };
    }
}
