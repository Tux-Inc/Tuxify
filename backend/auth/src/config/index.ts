/*
File Name: index.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Configuration file for the auth module

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

import { join } from "path";
import { readFileSync } from "fs";
import { Injectable } from "@nestjs/common";
import { LoadStrategy } from "@mikro-orm/core";
import { IConfig } from "./interfaces/config.interface";
import { isUndefined } from "../common/utils/validation.util";
import { redisUrlParser } from "./utils/redis-url-parser.util";
import { defineConfig as definePGConfig } from "@mikro-orm/postgresql";
import { defineConfig as defineSqliteConfig } from "@mikro-orm/sqlite";

/**
 * The `config` function returns a configuration object with various properties
 * and values based on environment variables.
 * @returns The `config()` function returns an object of type `IConfig`.
 */
export function config(): IConfig {
    const publicKey = readFileSync(
        join(__dirname, "..", "..", "keys/public.key"),
        "utf-8",
    );
    const privateKey = readFileSync(
        join(__dirname, "..", "..", "keys/private.key"),
        "utf-8",
    );
    const testing = process.env.NODE_ENV !== "production";
    const dbOptions = {
        entities: ["dist/**/*.entity.js", "dist/**/*.embeddable.js"],
        entitiesTs: ["src/**/*.entity.ts", "src/**/*.embeddable.ts"],
        loadStrategy: LoadStrategy.JOINED,
        allowGlobalContext: true,
    };

    return {
        id: process.env.NESTSV_AUTH_ID,
        url: process.env.NESTSV_AUTH_URL,
        port: parseInt(process.env.NESTSV_AUTH_PORT, 10),
        domain: process.env.NESTSV_AUTH_DOMAIN,
        jwt: {
            access: {
                privateKey,
                publicKey,
                time: parseInt(process.env.JWT_ACCESS_TIME, 10),
            },
            confirmation: {
                secret: process.env.JWT_CONFIRMATION_SECRET,
                time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
            },
            resetPassword: {
                secret: process.env.JWT_RESET_PASSWORD_SECRET,
                time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
            },
            refresh: {
                secret: process.env.JWT_REFRESH_SECRET,
                time: parseInt(process.env.JWT_REFRESH_TIME, 10),
            },
        },
        emailService: {
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        },
        db: definePGConfig({
            ...dbOptions,
            password: process.env.POSTGRES_PASSWORD,
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT, 10),
            dbName: process.env.POSTGRES_DB,
            schema: process.env.POSTGRES_DB,
        }),
        redis: redisUrlParser(process.env.REDIS_HOST),
        throttler: {
            ttl: parseInt(process.env.NESTSV_AUTH_THROTTLE_TTL, 10),
            limit: parseInt(process.env.NESTSV_AUTH_THROTTLE_LIMIT, 10),
        },
        testing,
        oauth2: {
            microsoft:
                isUndefined(process.env.MICROSOFT_CLIENT_ID) ||
                isUndefined(process.env.MICROSOFT_CLIENT_SECRET)
                    ? null
                    : {
                          id: process.env.MICROSOFT_CLIENT_ID,
                          secret: process.env.MICROSOFT_CLIENT_SECRET,
                      },
            google:
                isUndefined(process.env.GOOGLE_CLIENT_ID) ||
                isUndefined(process.env.GOOGLE_CLIENT_SECRET)
                    ? null
                    : {
                          id: process.env.GOOGLE_CLIENT_ID,
                          secret: process.env.GOOGLE_CLIENT_SECRET,
                      },
            facebook:
                isUndefined(process.env.FACEBOOK_CLIENT_ID) ||
                isUndefined(process.env.FACEBOOK_CLIENT_SECRET)
                    ? null
                    : {
                          id: process.env.FACEBOOK_CLIENT_ID,
                          secret: process.env.FACEBOOK_CLIENT_SECRET,
                      },
            github:
                isUndefined(process.env.GH_CLIENT_ID) ||
                isUndefined(process.env.GH_CLIENT_SECRET)
                    ? null
                    : {
                          id: process.env.GH_CLIENT_ID,
                          secret: process.env.GH_CLIENT_SECRET,
                      },
        },
    };
}
