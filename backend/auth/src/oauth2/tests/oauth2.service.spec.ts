/*
File Name: oauth2.service.spec.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Unit tests for oauth2 service

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

import { config } from "../../config";
import { faker } from "@faker-js/faker";
import { isJWT } from "class-validator";
import { HttpModule } from "@nestjs/axios";
import { MikroORM } from "@mikro-orm/core";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "../../jwt/jwt.module";
import { Oauth2Service } from "../oauth2.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "../../users/users.module";
import { UsersService } from "../../users/users.service";
import { CommonModule } from "../../common/common.module";
import { CommonService } from "../../common/common.service";
import { validationSchema } from "../../config/config.schema";
import { MikroOrmConfig } from "../../config/mikroorm.config";
import { OAuthProvidersEnum } from "../../users/enums/oauth-providers.enum";

describe("Oauth2Service", () => {
    let module: TestingModule,
        oauth2Service: Oauth2Service,
        usersService: UsersService,
        commonService: CommonService,
        orm: MikroORM;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema,
                    load: [config],
                }),
                CacheModule.register({
                    isGlobal: true,
                    ttl: parseInt(process.env.JWT_REFRESH_TIME, 10),
                }),
                MikroOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    useClass: MikroOrmConfig,
                }),
                CommonModule,
                UsersModule,
                JwtModule,
                HttpModule.register({
                    timeout: 5000,
                    maxRedirects: 5,
                }),
            ],
            providers: [Oauth2Service, CommonModule],
        }).compile();

        oauth2Service = module.get<Oauth2Service>(Oauth2Service);
        usersService = module.get<UsersService>(UsersService);
        commonService = module.get<CommonService>(CommonService);
        orm = module.get<MikroORM>(MikroORM);
        await orm.getSchemaGenerator().createSchema();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
        expect(oauth2Service).toBeDefined();
        expect(usersService).toBeDefined();
        expect(commonService).toBeDefined();
        expect(orm).toBeDefined();
    });

    describe("getAuthorizationUrl", () => {
        it("should return the microsoft authorization url", () => {
            const url = oauth2Service.getAuthorizationUrl(
                OAuthProvidersEnum.MICROSOFT,
            );
            expect(url).toBeDefined();
            expect(url).toContain(
                "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            );
        });
        it("should return the google authorization url", () => {
            const url = oauth2Service.getAuthorizationUrl(
                OAuthProvidersEnum.GOOGLE,
            );
            expect(url).toBeDefined();
            expect(url).toContain(
                "https://accounts.google.com/o/oauth2/v2/auth",
            );
        });
        it("should return the facebook authorization url", () => {
            const url = oauth2Service.getAuthorizationUrl(
                OAuthProvidersEnum.FACEBOOK,
            );
            expect(url).toBeDefined();
            expect(url).toContain("https://facebook.com/v9.0/dialog/oauth");
        });
        it("should return the github authorization url", () => {
            const url = oauth2Service.getAuthorizationUrl(
                OAuthProvidersEnum.GITHUB,
            );
            expect(url).toBeDefined();
            expect(url).toContain("https://github.com/login/oauth/authorize");
        });
    });

    describe("login", () => {
        const email = faker.internet.email();
        const name = faker.name.fullName();

        it("should create a new user", async () => {
            const [accessToken, refreshToken] = await oauth2Service.login(
                OAuthProvidersEnum.GOOGLE,
                email,
                name,
            );

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
            expect(isJWT(accessToken)).toBeTruthy();
            expect(isJWT(refreshToken)).toBeTruthy();

            const user = await usersService.findOneByEmail(email);
            expect(user).toBeDefined();
            expect(user.confirmed).toBeTruthy();
            expect(user.id).toStrictEqual(1);

            const providers = await usersService.findOAuthProviders(user.id);
            expect(providers).toBeDefined();
            expect(providers).toHaveLength(1);
            expect(providers[0].provider).toBe(OAuthProvidersEnum.GOOGLE);
        });

        it("should login an existing user", async () => {
            const [accessToken, refreshToken] = await oauth2Service.login(
                OAuthProvidersEnum.MICROSOFT,
                email,
                name,
            );

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
            expect(isJWT(accessToken)).toBeTruthy();
            expect(isJWT(refreshToken)).toBeTruthy();

            const user = await usersService.findOneByEmail(email);
            expect(user).toBeDefined();
            expect(user.confirmed).toBeTruthy();
            expect(user.id).toStrictEqual(1);
            const providers = await usersService.findOAuthProviders(user.id);
            expect(providers).toBeDefined();
            expect(providers).toHaveLength(2);
            expect(providers[0].provider).toBe(OAuthProvidersEnum.GOOGLE);
            expect(providers[1].provider).toBe(OAuthProvidersEnum.MICROSOFT);
        });
    });

    afterAll(async () => {
        await orm.getSchemaGenerator().dropSchema();
        await orm.close(true);
        await module.close();
    });
});
