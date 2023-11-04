/*
File Name: oauth.class.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: OAuth class

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

import { randomBytes } from "crypto";
import { AuthorizationCode } from "simple-oauth2";
import { IClient } from "../interfaces/client.interface";
import { IProvider } from "../interfaces/provider.interface";
import { IAuthParams } from "../interfaces/auth-params.interface";
import { OAuthProvidersEnum } from "../../users/enums/oauth-providers.enum";
import { IAuthResponseTokensInterface } from "../interfaces/auth-response-tokens.interface";

/* The `OAuthClass` is a TypeScript class that handles OAuth authentication for
different providers such as Microsoft, Google, Facebook, and GitHub. */
export class OAuthClass {
    /* The code `private static readonly [OAuthProvidersEnum.MICROSOFT]: IProvider
    = { ... }` is defining a static readonly property in the `OAuthClass`
    class. */
    private static readonly [OAuthProvidersEnum.MICROSOFT]: IProvider = {
        authorizeHost: "https://login.microsoftonline.com",
        authorizePath: "/common/oauth2/v2.0/authorize",
        tokenHost: "https://login.microsoftonline.com",
        tokenPath: "/common/oauth2/v2.0/token",
    };
    /* This code is defining a static readonly property in the `OAuthClass` class
    for the Google OAuth provider. The property is named
    `[OAuthProvidersEnum.GOOGLE]` and its value is an object of type
    `IProvider`. */
    private static readonly [OAuthProvidersEnum.GOOGLE]: IProvider = {
        authorizeHost: "https://accounts.google.com",
        authorizePath: "/o/oauth2/v2/auth?access_type=offline&",
        tokenHost: "https://www.googleapis.com",
        tokenPath: "/oauth2/v4/token",
    };
    /* This code is defining a static readonly property in the `OAuthClass` class
    for the Facebook OAuth provider. The property is named
    `[OAuthProvidersEnum.FACEBOOK]` and its value is an object of type
    `IProvider`. The object contains the necessary information for
    authorization and token retrieval for the Facebook OAuth provider,
    including the authorize host, authorize path, token host, and token path. */
    private static readonly [OAuthProvidersEnum.FACEBOOK]: IProvider = {
        authorizeHost: "https://facebook.com",
        authorizePath: "/v9.0/dialog/oauth",
        tokenHost: "https://graph.facebook.com",
        tokenPath: "/v9.0/oauth/access_token",
    };
    /* This code is defining a static readonly property in the `OAuthClass` class
    for the GitHub OAuth provider. The property is named
    `[OAuthProvidersEnum.GITHUB]` and its value is an object of type
    `IProvider`. The object contains the necessary information for
    authorization and token retrieval for the GitHub OAuth provider, including
    the authorize host, authorize path, token host, and token path. */
    private static readonly [OAuthProvidersEnum.GITHUB]: IProvider = {
        authorizeHost: "https://github.com",
        authorizePath: "/login/oauth/authorize",
        tokenHost: "https://github.com",
        tokenPath: "/login/oauth/access_token",
    };
    /* The `private static userDataUrls` property is a mapping of
    `OAuthProvidersEnum` values to their respective user data URLs. It is used
    to determine the URL where user data can be retrieved for each OAuth
    provider. */
    private static userDataUrls: Record<OAuthProvidersEnum, string> = {
        [OAuthProvidersEnum.GOOGLE]:
            "https://www.googleapis.com/oauth2/v3/userinfo",
        [OAuthProvidersEnum.MICROSOFT]: "https://graph.microsoft.com/v1.0/me",
        [OAuthProvidersEnum.FACEBOOK]:
            "https://graph.facebook.com/v16.0/me?fields=email,name",
        [OAuthProvidersEnum.GITHUB]: "https://api.github.com/user",
        [OAuthProvidersEnum.LOCAL]: "",
    };

    private readonly code: AuthorizationCode;
    private readonly authorization: IAuthParams;
    private readonly userDataUrl: string;

    /**
     * The constructor initializes the OAuth provider, client, URL, and other
     * properties based on the given parameters.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * value that represents the OAuth provider. It determines which OAuth
     * provider will be used for authentication.
     * @param {IClient} client - The `client` parameter is an instance of the
     * `IClient` interface. It represents the client application that is making
     * the OAuth request.
     * @param {string} url - The `url` parameter is a string that represents the
     * URL where the OAuth authorization process will take place. This URL is
     * typically provided by the OAuth provider and is used to redirect the user
     * after they have granted permission to the client application.
     */
    constructor(
        private readonly provider: OAuthProvidersEnum,
        private readonly client: IClient,
        private readonly url: string,
    ) {
        if (provider === OAuthProvidersEnum.LOCAL) {
            throw new Error("Invalid provider");
        }

        this.code = new AuthorizationCode({
            client,
            auth: OAuthClass[provider],
        });
        this.authorization = OAuthClass.genAuthorization(provider, url);
        this.userDataUrl = OAuthClass.userDataUrls[provider];
    }

    /**
     * The function returns the state property of the authorization object.
     * @returns The state property of the authorization object.
     */
    public get state(): string {
        return this.authorization.state;
    }

    /**
     * The function returns the data URL of the user's data.
     * @returns The `dataUrl` property is being returned as a string.
     */
    public get dataUrl(): string {
        return this.userDataUrl;
    }

    /**
     * The function returns the authorization URL for the given authorization
     * code.
     * @returns The authorization URL is being returned.
     */
    public get authorizationUrl(): string {
        return this.code.authorizeURL(this.authorization);
    }

    /**
     * The function `genAuthorization` generates authorization parameters based on
     * the selected OAuth provider.
     * @param {OAuthProvidersEnum} provider - The provider parameter is an enum
     * that represents the OAuth provider. It can have the following values:
     * @param {string} url - The `url` parameter is the base URL of your
     * application. It is used to construct the redirect URI for the OAuth
     * provider's callback endpoint.
     * @returns The function `genAuthorization` returns an object of type
     * `IAuthParams`.
     */
    private static genAuthorization(
        provider: OAuthProvidersEnum,
        url: string,
    ): IAuthParams {
        const redirect_uri = `${url}/api/auth/ext/${provider}/callback`;
        const state = randomBytes(16).toString("hex");

        switch (provider) {
            case OAuthProvidersEnum.GOOGLE:
                return {
                    state,
                    redirect_uri,
                    scope: [
                        "https://www.googleapis.com/auth/userinfo.email",
                        "https://www.googleapis.com/auth/userinfo.profile",
                        "https://mail.google.com/",
                        "https://www.googleapis.com/auth/gmail.modify",
                        "https://www.googleapis.com/auth/gmail.compose",
                        "https://www.googleapis.com/auth/gmail.send",
                        "https://www.googleapis.com/auth/gmail.readonly",
                        "https://www.googleapis.com/auth/gmail.metadata",
                        "https://www.googleapis.com/auth/gmail.insert",
                        "https://www.googleapis.com/auth/gmail.labels",
                    ],
                };
            case OAuthProvidersEnum.MICROSOFT:
                return {
                    state,
                    redirect_uri,
                    scope: ["openid", "profile", "email"],
                };
            case OAuthProvidersEnum.FACEBOOK:
                return {
                    state,
                    redirect_uri,
                    scope: ["email", "public_profile"],
                };
            case OAuthProvidersEnum.GITHUB:
                return {
                    state,
                    redirect_uri,
                    scope: ["user:email", "read:user"],
                };
        }
    }

    /**
     * The function `getToken` is an asynchronous function that takes a code as
     * input and returns a promise that resolves to an object containing an access
     * token and a refresh token.
     * @param {string} code - The "code" parameter is a string that represents the
     * authorization code obtained from the authorization server. This code is
     * typically obtained after the user has successfully authenticated and
     * authorized the application to access their resources.
     * @returns an object of type `IAuthResponseTokensInterface` with two
     * properties: `accessToken` and `refreshToken`.
     */
    public async getToken(code: string): Promise<IAuthResponseTokensInterface> {
        const result = await this.code.getToken({
            code,
            redirect_uri: this.authorization.redirect_uri,
            scope: this.authorization.scope,
        });
        return {
            accessToken: result.token.access_token as string,
            refreshToken: result.token.refresh_token as string,
        };
    }
}
