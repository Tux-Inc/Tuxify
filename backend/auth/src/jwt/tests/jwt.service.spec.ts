/*
File Name: jwt.service.spec.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: JWT service test file

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

import { promisify } from "util";
import { sign } from "jsonwebtoken";
import { config } from "../../config";
import { faker } from "@faker-js/faker";
import { JwtService } from "../jwt.service";
import { ConfigModule } from "@nestjs/config";
import { isJWT, isUUID } from "class-validator";
import { Test, TestingModule } from "@nestjs/testing";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { CommonModule } from "../../common/common.module";
import { validationSchema } from "../../config/config.schema";
import { IUser } from "../../users/interfaces/user.interface";
import { IEmailToken } from "../interfaces/email-token.interface";
import { IAccessToken } from "../interfaces/access-token.interface";
import { IRefreshToken } from "../interfaces/refresh-token.interface";

describe("JwtService", () => {
    let service: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema,
                    load: [config],
                }),
                CommonModule,
            ],
            providers: [JwtService, CommonModule],
        }).compile();

        service = module.get<JwtService>(JwtService);
    });

    const user = {
        id: 1,
        email: faker.internet.email().toLowerCase(),
        credentials: {
            version: 2,
        },
    } as IUser;

    describe("access tokens", () => {
        let token: string;

        it("should generate a token", async () => {
            token = await service.generateToken(user, TokenTypeEnum.ACCESS);
            expect(token).toBeDefined();
            expect(isJWT(token)).toBe(true);
        });

        it("should verify a token", async () => {
            const decoded = await service.verifyToken<IAccessToken>(
                token,
                TokenTypeEnum.ACCESS,
            );
            expect(decoded).toBeDefined();
            expect(decoded.id).toEqual(user.id);
            expect(decoded.sub).toEqual(user.email);
            expect(decoded.aud).toEqual(process.env.NESTSV_AUTH_DOMAIN);
            expect(decoded.iss).toEqual(process.env.NESTSV_AUTH_ID);
            expect(decoded.iat).toBeDefined();
            expect(decoded.exp).toBeDefined();
        });

        it("should throw an error if the token is invalid", async () => {
            const invalidToken = token + "invalid";
            await expect(
                service.verifyToken<IAccessToken>(
                    invalidToken,
                    TokenTypeEnum.ACCESS,
                ),
            ).rejects.toThrow("Invalid token");
        });

        it("should throw an error if the token is expired", async () => {
            const expiredToken = sign(
                {
                    id: user.id,
                    version: user.credentials.version,
                },
                process.env.JWT_CONFIRMATION_SECRET,
                {
                    expiresIn: 1,
                    issuer: process.env.NESTSV_AUTH_ID,
                    audience: process.env.NESTSV_AUTH_DOMAIN,
                    subject: user.email,
                },
            );
            const timeout = promisify(setTimeout);
            await timeout(1001);
            await expect(
                service.verifyToken<IEmailToken>(
                    expiredToken,
                    TokenTypeEnum.CONFIRMATION,
                ),
            ).rejects.toThrow("Token expired");
        });
    });

    describe("refresh tokens", () => {
        let token: string;

        it("should generate a token", async () => {
            token = await service.generateToken(user, TokenTypeEnum.REFRESH);
            expect(token).toBeDefined();
            expect(isJWT(token)).toBe(true);
        });

        it("should verify a token", async () => {
            const decoded = await service.verifyToken<IRefreshToken>(
                token,
                TokenTypeEnum.REFRESH,
            );
            expect(decoded).toBeDefined();
            expect(decoded.id).toEqual(user.id);
            expect(decoded.version).toEqual(user.credentials.version);
            expect(decoded.tokenId).toBeDefined();
            expect(isUUID(decoded.tokenId)).toBe(true);
            expect(decoded.sub).toEqual(user.email);
            expect(decoded.aud).toEqual(process.env.NESTSV_AUTH_DOMAIN);
            expect(decoded.iss).toEqual(process.env.NESTSV_AUTH_ID);
            expect(decoded.iat).toBeDefined();
            expect(decoded.exp).toBeDefined();
        });

        it("should throw an error if the token is invalid", async () => {
            const invalidToken = token + "invalid";
            await expect(
                service.verifyToken<IRefreshToken>(
                    invalidToken,
                    TokenTypeEnum.REFRESH,
                ),
            ).rejects.toThrow("Invalid token");
        });
    });

    describe("confirmation tokens", () => {
        let token: string;

        it("should generate a token", async () => {
            token = await service.generateToken(
                user,
                TokenTypeEnum.CONFIRMATION,
            );
            expect(token).toBeDefined();
            expect(isJWT(token)).toBe(true);
        });

        it("should verify a token", async () => {
            const decoded = await service.verifyToken<IEmailToken>(
                token,
                TokenTypeEnum.CONFIRMATION,
            );
            expect(decoded).toBeDefined();
            expect(decoded.id).toEqual(user.id);
            expect(decoded.version).toEqual(user.credentials.version);
            expect(decoded.sub).toEqual(user.email);
            expect(decoded.aud).toEqual(process.env.NESTSV_AUTH_DOMAIN);
            expect(decoded.iss).toEqual(process.env.NESTSV_AUTH_ID);
            expect(decoded.iat).toBeDefined();
            expect(decoded.exp).toBeDefined();
        });

        it("should throw an error if the token is invalid", async () => {
            const invalidToken = token + "invalid";
            await expect(
                service.verifyToken<IEmailToken>(
                    invalidToken,
                    TokenTypeEnum.CONFIRMATION,
                ),
            ).rejects.toThrow("Invalid token");
        });
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
