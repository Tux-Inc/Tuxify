/*
File Name: oauth2.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for oauth2

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
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { AxiosError } from "axios";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "../jwt/jwt.service";
import { catchError, firstValueFrom } from "rxjs";
import { OAuthClass } from "./classes/oauth.class";
import { ClientProxy } from "@nestjs/microservices";
import { UsersService } from "../users/users.service";
import { IClient } from "./interfaces/client.interface";
import { CommonService } from "../common/common.service";
import { isNull } from "../common/utils/validation.util";
import { ICallbackQuery } from "./interfaces/callback-query.interface";
import { OAuthProvidersEnum } from "../users/enums/oauth-providers.enum";
import { LocalUserProviderTokensDto } from "./dtos/local-user-provider-tokens.dto";
import { IAuthResponseTokensInterface } from "./interfaces/auth-response-tokens.interface";

/* The `Oauth2Service` class is responsible for handling OAuth2 authentication and
authorization for multiple providers such as Microsoft, Google, Facebook, and
GitHub. */
@Injectable()
export class Oauth2Service {
    private readonly [OAuthProvidersEnum.MICROSOFT]: OAuthClass | null;
    private readonly [OAuthProvidersEnum.GOOGLE]: OAuthClass | null;
    private readonly [OAuthProvidersEnum.FACEBOOK]: OAuthClass | null;
    private readonly [OAuthProvidersEnum.GITHUB]: OAuthClass | null;

    /**
     * The constructor initializes various services and sets up OAuth providers
     * for Microsoft, Google, Facebook, and GitHub.
     * @param {UsersService} usersService - An instance of the UsersService class,
     * which is responsible for handling user-related operations such as creating,
     * updating, and deleting users.
     * @param {JwtService} jwtService - The `jwtService` parameter is an instance
     * of the `JwtService` class, which is used for generating and verifying JSON
     * Web Tokens (JWTs). JWTs are used for authentication and authorization
     * purposes in web applications.
     * @param {ConfigService} configService - The `configService` is a service
     * that provides access to configuration values. It is used to retrieve the
     * value of the "url" configuration property.
     * @param {HttpService} httpService - The `httpService` parameter is an
     * instance of the `HttpService` class. It is used to make HTTP requests to
     * external APIs or services.
     * @param {CommonService} commonService - The `commonService` parameter is an
     * instance of the `CommonService` class. It is used to provide common
     * functionality or services that are shared across different parts of the
     * application.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is used for communication with a NATS server. It is
     * injected using the `@Inject` decorator.
     */
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly commonService: CommonService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        const url = configService.get<string>("url");
        this[OAuthProvidersEnum.MICROSOFT] = Oauth2Service.setOAuthClass(
            OAuthProvidersEnum.MICROSOFT,
            configService,
            url,
        );
        this[OAuthProvidersEnum.GOOGLE] = Oauth2Service.setOAuthClass(
            OAuthProvidersEnum.GOOGLE,
            configService,
            url,
        );
        this[OAuthProvidersEnum.FACEBOOK] = Oauth2Service.setOAuthClass(
            OAuthProvidersEnum.FACEBOOK,
            configService,
            url,
        );
        this[OAuthProvidersEnum.GITHUB] = Oauth2Service.setOAuthClass(
            OAuthProvidersEnum.GITHUB,
            configService,
            url,
        );
    }

    /**
     * The function sets up an OAuthClass instance based on the provider, client
     * configuration, and URL provided.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * that represents the OAuth provider. It specifies which OAuth provider is
     * being used, such as Google, Facebook, or GitHub.
     * @param {ConfigService} configService - The `configService` parameter is an
     * instance of a service or class that provides access to configuration
     * settings. It is used to retrieve the client configuration for the specified
     * OAuth provider.
     * @param {string} url - The `url` parameter is a string that represents the
     * URL of the OAuth provider's authorization endpoint. This is the endpoint
     * where users will be redirected to in order to authenticate and authorize
     * the application.
     * @returns an instance of the `OAuthClass` if the `client` is not null,
     * otherwise it returns null.
     */
    private static setOAuthClass(
        provider: OAuthProvidersEnum,
        configService: ConfigService,
        url: string,
    ): OAuthClass | null {
        const client = configService.get<IClient | null>(
            `oauth2.${provider.toLowerCase()}`,
        );

        if (isNull(client)) {
            return null;
        }

        return new OAuthClass(provider, client, url);
    }

    /**
     * The function returns the authorization URL for a given OAuth provider.
     * @param {OAuthProvidersEnum} provider - The parameter "provider" is of type
     * "OAuthProvidersEnum". It is used to specify the OAuth provider for which
     * you want to get the authorization URL.
     * @returns The authorization URL for the specified OAuth provider.
     */
    public getAuthorizationUrl(provider: OAuthProvidersEnum): string {
        return this.getOAuth(provider).authorizationUrl;
    }

    /**
     * The function `getUserData` retrieves user data from an OAuth provider and
     * returns it along with the access tokens.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * value that represents the OAuth provider from which to retrieve user data.
     * It could be one of the values defined in the `OAuthProvidersEnum` enum.
     * @param {ICallbackQuery} cbQuery - The `cbQuery` parameter is an object that
     * represents a callback query. It typically contains information about the
     * query, such as the code and state, which are used to obtain access tokens
     * for the specified OAuth provider.
     * @returns a Promise of type T, which is a generic type that extends
     * Record<string, any>. The returned value is an object that contains the
     * userData.data and tokens properties.
     */
    public async getUserData<T extends Record<string, any>>(
        provider: OAuthProvidersEnum,
        cbQuery: ICallbackQuery,
    ): Promise<T> {
        const { code, state } = cbQuery;
        const tokens = await this.getAccessToken(provider, code, state);
        const userData = await firstValueFrom(
            this.httpService
                .get<T>(this.getOAuth(provider).dataUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.accessToken}`,
                    },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        throw new UnauthorizedException(error.response.data);
                    }),
                ),
        );
        return { ...userData.data, tokens };
    }

    /**
     * The login function takes in user information and tokens, finds or creates a
     * user, emits an event, and returns authentication tokens.
     * @param {OAuthProvidersEnum} provider - The provider parameter is an enum
     * that represents the OAuth provider used for authentication. It could be one
     * of the following values: Google, Facebook, Twitter, etc.
     * @param {string} email - The email parameter is a string that represents the
     * user's email address.
     * @param {string} name - The "name" parameter is a string that represents the
     * name of the user.
     * @param {IAuthResponseTokensInterface} tokens - The "tokens" parameter is an
     * object that contains the access token and refresh token obtained from the
     * OAuth provider during the authentication process.
     * @returns a Promise that resolves to an array of two strings.
     */
    public async login(
        provider: OAuthProvidersEnum,
        email: string,
        name: string,
        tokens: IAuthResponseTokensInterface,
    ): Promise<[string, string]> {
        const user = await this.usersService.findOrCreate(
            provider,
            email,
            name,
        );
        const localUserProviderTokens: LocalUserProviderTokensDto = {
            userId: user.id,
            provider,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
        this.natsClient.emit("oauth2.user.connected", localUserProviderTokens);
        return this.jwtService.generateAuthTokens(user);
    }

    /**
     * The function returns the OAuthClass instance for a given OAuth provider, or
     * throws a NotFoundException if the provider is not found.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is of type
     * `OAuthProvidersEnum`. It is used to specify the OAuth provider for which
     * you want to retrieve the OAuth class.
     * @returns an instance of the OAuthClass.
     */
    private getOAuth(provider: OAuthProvidersEnum): OAuthClass {
        const oauth = this[provider];

        if (isNull(oauth)) {
            throw new NotFoundException("Page not found");
        }

        return oauth;
    }

    /**
     * The function `getAccessToken` is a private asynchronous method that takes
     * in a provider, code, and state as parameters, and returns a promise that
     * resolves to an object containing authentication response tokens.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * that represents the OAuth provider. It specifies which OAuth provider the
     * user is authenticating with, such as Google, Facebook, or Twitter.
     * @param {string} code - The `code` parameter is a string that represents the
     * authorization code obtained from the OAuth provider. This code is used to
     * exchange for an access token.
     * @param {string} state - The "state" parameter is a unique value generated
     * by the client application and included in the authorization request. It is
     * used to prevent cross-site request forgery attacks by ensuring that the
     * authorization response matches the initial request.
     * @returns a Promise that resolves to an object of type
     * IAuthResponseTokensInterface.
     */
    private async getAccessToken(
        provider: OAuthProvidersEnum,
        code: string,
        state: string,
    ): Promise<IAuthResponseTokensInterface> {
        const oauth = this.getOAuth(provider);

        if (state !== oauth.state) {
            throw new UnauthorizedException("Corrupted state");
        }

        return await this.commonService.throwInternalError(
            oauth.getToken(code),
        );
    }
}
