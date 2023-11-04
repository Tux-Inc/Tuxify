/*
File Name: redis-url-parser.util.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Redis url parser util

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

import { RedisOptions } from "ioredis";

/**
 * The `redisUrlParser` function parses a Redis connection URL and returns the
 * RedisOptions object containing the host, port, and password (if provided).
 * @param {string} url - The `url` parameter is a string that represents the Redis
 * connection URL.
 * @returns The function `redisUrlParser` returns an object of type
 * `RedisOptions`.
 */
export const redisUrlParser = (url: string): RedisOptions => {
    if (url.includes("://:")) {
        const arr = url.split("://:")[1].split("@");
        const secondArr = arr[1].split(":");

        return {
            password: arr[0],
            host: secondArr[0],
            port: parseInt(secondArr[1], 10),
        };
    }

    const connectionString = url.split("://")[1];
    const arr = connectionString.split(":");
    return {
        host: arr[0],
        port: parseInt(arr[1], 10),
    };
};
