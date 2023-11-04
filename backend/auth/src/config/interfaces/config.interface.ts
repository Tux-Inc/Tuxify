/*
File Name: config.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Config interface

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
import { IJwt } from "./jwt.interface";
import { IOAuth2 } from "./oauth2.interface";
import { ThrottlerOptions } from "@nestjs/throttler";
import { IEmailConfig } from "./email-config.interface";
import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";

/* The `export interface IConfig` is defining an interface in TypeScript. An
interface is a way to define the structure of an object. In this case, the
`IConfig` interface is defining the structure of a configuration object. */
export interface IConfig {
    readonly id: string;
    readonly url: string;
    readonly port: number;
    readonly domain: string;
    readonly db: MikroOrmModuleOptions;
    readonly redis: RedisOptions;
    readonly jwt: IJwt;
    readonly emailService: IEmailConfig;
    readonly throttler: ThrottlerOptions;
    readonly testing: boolean;
    readonly oauth2: IOAuth2;
}
