/*
File Name: jwt.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: JWT service

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
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import {
    IAccessPayload,
    IAccessToken,
} from "./interfaces/access-token.interface";
import {
    IRefreshPayload,
    IRefreshToken,
} from "./interfaces/refresh-token.interface";
import { v4 } from "uuid";
import * as jwt from "jsonwebtoken";
import { logger } from "@mikro-orm/nestjs";
import { ConfigService } from "@nestjs/config";
import { TokenTypeEnum } from "./enums/token-type.enum";
import { CommonService } from "../common/common.service";
import { IJwt } from "../config/interfaces/jwt.interface";
import { IUser } from "../users/interfaces/user.interface";
import { IEmailPayload, IEmailToken } from "./interfaces/email-token.interface";

/* The JwtService class is responsible for generating and verifying JSON Web
Tokens (JWTs) for different token types. */
@Injectable()
export class JwtService {
    private static logger: Logger = new Logger(JwtService.name);
    private readonly jwtConfig: IJwt;
    private readonly issuer: string;
    private readonly domain: string;

    /**
     * The constructor initializes private variables using values retrieved from
     * the configService.
     * @param {ConfigService} configService - The `configService` parameter is an
     * instance of the `ConfigService` class. It is used to retrieve configuration
     * values from a configuration file or environment variables.
     * @param {CommonService} commonService - The `commonService` parameter is an
     * instance of the `CommonService` class. It is used to access common
     * functionalities or services that are shared across different parts of the
     * codebase.
     */
    constructor(
        private readonly configService: ConfigService,
        private readonly commonService: CommonService,
    ) {
        this.jwtConfig = this.configService.get<IJwt>("jwt");
        this.issuer = this.configService.get<string>("id");
        this.domain = this.configService.get<string>("domain");
    }

    /**
     * The function generates a token asynchronously using the provided payload,
     * secret, and options.
     * @param {IAccessPayload | IEmailPayload | IRefreshPayload} payload - The
     * `payload` parameter is an object that contains the data that you want to
     * include in the token. It can be of type `IAccessPayload`, `IEmailPayload`,
     * or `IRefreshPayload`, depending on the specific requirements of your
     * application.
     * @param {string} secret - The `secret` parameter is a string that is used as
     * the secret key to sign the token. It should be a unique and secure value
     * that is known only to the server generating the token.
     * @param options - The `options` parameter is an object that contains various
     * options for configuring the JWT token generation. Some common options
     * include:
     * @returns a Promise that resolves to a string.
     */
    private static async generateTokenAsync(
        payload: IAccessPayload | IEmailPayload | IRefreshPayload,
        secret: string,
        options: jwt.SignOptions,
    ): Promise<string> {
        return new Promise((resolve, rejects) => {
            jwt.sign(payload, secret, options, (error, token) => {
                if (error) {
                    rejects(error);
                    return;
                }
                resolve(token);
            });
        });
    }

    /**
     * The function `verifyTokenAsync` is a TypeScript function that verifies a
     * JWT token using a secret and options, and returns a promise that resolves
     * to the payload of the token.
     * @param {string} token - The token parameter is a string that represents the
     * JWT (JSON Web Token) that needs to be verified.
     * @param {string} secret - The `secret` parameter is a string that represents
     * the secret key used to sign and verify the token. This secret key should be
     * kept secure and should only be known by the parties involved in token
     * generation and verification.
     * @param options - The `options` parameter is an object that contains various
     * options for verifying the token. Some common options include:
     * @returns a Promise that resolves to a value of type T.
     */
    private static async verifyTokenAsync<T>(
        token: string,
        secret: string,
        options: jwt.VerifyOptions,
    ): Promise<T> {
        return new Promise((resolve, rejects) => {
            jwt.verify(token, secret, options, (error, payload: T) => {
                if (error) {
                    rejects(error);
                    return;
                }
                resolve(payload);
            });
        });
    }

    /**
     * The function `throwBadRequest` is a TypeScript function that handles errors
     * related to token expiration and invalidity, and throws appropriate
     * exceptions.
     * @param promise - A promise that resolves to an instance of either
     * IAccessToken, IRefreshToken, or IEmailToken.
     * @returns a Promise of type T.
     */
    private static async throwBadRequest<
        T extends IAccessToken | IRefreshToken | IEmailToken,
    >(promise: Promise<T>): Promise<T> {
        try {
            return await promise;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                this.logger.error("TokenExpiredError", error);
                throw new BadRequestException("Token expired");
            }
            if (error instanceof jwt.JsonWebTokenError) {
                this.logger.error("JsonWebTokenError", error);
                throw new BadRequestException("Invalid token");
            }
            throw new InternalServerErrorException(error);
        }
    }

    /**
     * The `generateToken` function generates a token based on the provided user,
     * token type, domain, and token ID.
     * @param {IUser} user - The `user` parameter is an object of type `IUser`,
     * which represents a user in the system. It likely contains properties such
     * as `id`, `email`, and `credentials`.
     * @param {TokenTypeEnum} tokenType - The `tokenType` parameter is an enum
     * that specifies the type of token to be generated. It can have one of the
     * following values:
     * @param {string | null} [domain] - The `domain` parameter is an optional
     * string that represents the domain for which the token is being generated.
     * It is used as the audience claim in the JWT (JSON Web Token). If the
     * `domain` parameter is not provided, the `this.domain` value is used as the
     * default audience.
     * @param {string} [tokenId] - The `tokenId` parameter is an optional string
     * that represents the unique identifier for the token. It is used in the case
     * of refresh tokens to track and manage the validity of the token. If a
     * `tokenId` is not provided, a new one will be generated using the `v4()`
     * function from
     * @returns a Promise that resolves to a string.
     */
    public async generateToken(
        user: IUser,
        tokenType: TokenTypeEnum,
        domain?: string | null,
        tokenId?: string,
    ): Promise<string> {
        const jwtOptions: jwt.SignOptions = {
            issuer: this.issuer,
            subject: user.email,
            // audience: domain ?? this.domain,
            algorithm: "HS256",
        };

        switch (tokenType) {
            case TokenTypeEnum.ACCESS:
                const { privateKey, time: accessTime } = this.jwtConfig.access;
                return this.commonService.throwInternalError(
                    JwtService.generateTokenAsync({ id: user.id }, privateKey, {
                        ...jwtOptions,
                        expiresIn: accessTime,
                        algorithm: "RS256",
                    }),
                );
            case TokenTypeEnum.REFRESH:
                const { secret: refreshSecret, time: refreshTime } =
                    this.jwtConfig.refresh;
                return this.commonService.throwInternalError(
                    JwtService.generateTokenAsync(
                        {
                            id: user.id,
                            version: user.credentials.version,
                            tokenId: tokenId ?? v4(),
                        },
                        refreshSecret,
                        {
                            ...jwtOptions,
                            expiresIn: refreshTime,
                        },
                    ),
                );
            case TokenTypeEnum.CONFIRMATION:
            case TokenTypeEnum.RESET_PASSWORD:
                const { secret, time } = this.jwtConfig[tokenType];
                return this.commonService.throwInternalError(
                    JwtService.generateTokenAsync(
                        { id: user.id, version: user.credentials.version },
                        secret,
                        {
                            ...jwtOptions,
                            expiresIn: time,
                        },
                    ),
                );
        }
    }

    /**
     * The function `verifyToken` is a TypeScript function that verifies a token
     * based on its type and returns the decoded token.
     * @param {string} token - The `token` parameter is a string that represents
     * the token to be verified. It can be an access token, refresh token, or
     * email token depending on the `tokenType` parameter.
     * @param {TokenTypeEnum} tokenType - The `tokenType` parameter is an enum
     * that represents the type of token being verified. It can have one of the
     * following values:
     * @returns The function `verifyToken` returns a promise of type `T`, where
     * `T` is a type that extends `IAccessToken`, `IRefreshToken`, or
     * `IEmailToken`.
     */
    public async verifyToken<
        T extends IAccessToken | IRefreshToken | IEmailToken,
    >(token: string, tokenType: TokenTypeEnum): Promise<T> {
        const jwtOptions: jwt.VerifyOptions = {
            issuer: this.issuer,
            // audience: new RegExp(this.domain), // ENABLE FOR PRODUCTION
        };

        switch (tokenType) {
            case TokenTypeEnum.ACCESS:
                const { publicKey, time: accessTime } = this.jwtConfig.access;
                return JwtService.throwBadRequest(
                    JwtService.verifyTokenAsync(token, publicKey, {
                        ...jwtOptions,
                        maxAge: accessTime,
                        algorithms: ["RS256"],
                    }),
                );
            case TokenTypeEnum.REFRESH:
            case TokenTypeEnum.CONFIRMATION:
            case TokenTypeEnum.RESET_PASSWORD:
                const { secret, time } = this.jwtConfig[tokenType];
                return JwtService.throwBadRequest(
                    JwtService.verifyTokenAsync(token, secret, {
                        ...jwtOptions,
                        maxAge: time,
                        algorithms: ["HS256"],
                    }),
                );
        }
    }

    /**
     * The function "generateAuthTokens" generates access and refresh tokens for a
     * user.
     * @param {IUser} user - The `user` parameter is an object of type `IUser`. It
     * represents the user for whom the authentication tokens are being generated.
     * @param {string} [domain] - The `domain` parameter is an optional string
     * that represents the domain for which the tokens are being generated. It can
     * be used to specify the specific domain or subdomain for which the tokens
     * are valid. If not provided, the tokens will be valid for any domain.
     * @param {string} [tokenId] - The `tokenId` parameter is an optional string
     * that represents the unique identifier for the token. It is used to
     * differentiate between different tokens generated for the same user and
     * domain. If not provided, a new token will be generated.
     * @returns An array of two strings is being returned.
     */
    public async generateAuthTokens(
        user: IUser,
        domain?: string,
        tokenId?: string,
    ): Promise<[string, string]> {
        return Promise.all([
            this.generateToken(user, TokenTypeEnum.ACCESS, domain, tokenId),
            this.generateToken(user, TokenTypeEnum.REFRESH, domain, tokenId),
        ]);
    }
}
