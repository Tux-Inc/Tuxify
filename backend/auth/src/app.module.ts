/*
File Name: auth.module.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Module for auth

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

import { config } from "./config";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppService } from "./app.service";
import { JwtModule } from "./jwt/jwt.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CacheConfig } from "./config/cache.config";
import { CacheModule } from "@nestjs/cache-manager";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthGuard } from "./auth/guards/auth.guard";
import { CommonModule } from "./common/common.module";
import { Oauth2Module } from "./oauth2/oauth2.module";
import { validationSchema } from "./config/config.schema";
import { MikroOrmConfig } from "./config/mikroorm.config";
import { ThrottlerConfig } from "./config/throttler.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema,
            load: [config],
        }),
        MikroOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MikroOrmConfig,
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useClass: CacheConfig,
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useClass: ThrottlerConfig,
        }),
        CommonModule,
        UsersModule,
        AuthModule,
        JwtModule,
        Oauth2Module,
    ],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
/* The AppModule class is exported and serves as the main module for the
application. */
export class AppModule {}
