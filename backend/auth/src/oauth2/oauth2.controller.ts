/*
File Name: oauth2.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for oauth2

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
    Controller,
    Get,
    HttpStatus,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import {
    IFacebookUser,
    IGitHubUser,
    IGoogleUser,
    IMicrosoftUser,
} from "./interfaces/user-response.interface";
import { FastifyReply } from "fastify";
import { ConfigService } from "@nestjs/config";
import { Oauth2Service } from "./oauth2.service";
import { OAuthFlagGuard } from "./guards/oauth-flag.guard";
import { Public } from "../auth/decorators/public.decorator";
import { CallbackQueryDto } from "./dtos/callback-query.dto";
import { OAuthProvidersEnum } from "../users/enums/oauth-providers.enum";
import { ApiNotFoundResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
// import { FastifyThrottlerGuard } from '../auth/guards/fastify-throttler.guard';
import { IAuthResponseTokensInterface } from "./interfaces/auth-response-tokens.interface";

/* The `Oauth2Controller` class handles OAuth2 authentication and redirects users
to the respective OAuth providers for login and callback. */
@ApiTags("Oauth2")
@Controller("api/auth/ext")
// @UseGuards(FastifyThrottlerGuard)
export class Oauth2Controller {
    private readonly url: string;
    private readonly cookiePath = "/api/auth";
    private readonly cookieName: string;
    private readonly refreshTime: number;
    private readonly testing: boolean;

    /**
     * The constructor initializes the class with necessary dependencies and
     * retrieves configuration values.
     * @param {Oauth2Service} oauth2Service - The `oauth2Service` parameter is an
     * instance of the `Oauth2Service` class. It is used to handle OAuth2
     * authentication and authorization processes.
     * @param {ConfigService} configService - The `configService` is a service
     * that provides access to configuration values in your application. It is
     * used to retrieve values from your application's configuration file or
     * environment variables. In this case, it is used to retrieve values for the
     * `domain`, `REFRESH_COOKIE`, `jwt.refresh.time`, and
     */
    constructor(
        private readonly oauth2Service: Oauth2Service,
        private readonly configService: ConfigService,
    ) {
        this.url = `${this.configService.get<string>("domain")}`;
        this.cookieName = this.configService.get<string>("REFRESH_COOKIE");
        this.refreshTime = this.configService.get<number>("jwt.refresh.time");
        this.testing = this.configService.get<boolean>("testing");
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.MICROSOFT))
    @Get("microsoft")
    @ApiResponse({
        description: "Redirects to Microsoft OAuth2 login page",
        status: HttpStatus.TEMPORARY_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for Microsoft",
    })

    /**
     * The function redirects the user to the Microsoft OAuth provider.
     * @param {FastifyReply} res - The `res` parameter is an object representing
     * the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a class provided by the Fastify framework for
     * handling HTTP responses.
     * @returns the result of the `startRedirect` method with the `res` parameter
     * and the `OAuthProvidersEnum.MICROSOFT` argument.
     */
    public microsoft(@Res() res: FastifyReply): FastifyReply {
        return this.startRedirect(res, OAuthProvidersEnum.MICROSOFT);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.MICROSOFT))
    @Get("microsoft/callback")
    @ApiResponse({
        description: "Redirects to the frontend with the JWT token",
        status: HttpStatus.PERMANENT_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for Microsoft",
    })

    /**
     * The function `microsoftCallback` is an asynchronous function that handles
     * the callback from Microsoft OAuth provider, retrieves user data, and then
     * logs in the user and redirects them.
     * @param {CallbackQueryDto} cbQuery - The `cbQuery` parameter is of type
     * `CallbackQueryDto`. It is used to retrieve the callback query data from the
     * request.
     * @param {FastifyReply} res - The `res` parameter is the response object that
     * is used to send the response back to the client. It is of type
     * `FastifyReply`, which is a response object provided by the Fastify
     * framework.
     * @returns a Promise that resolves to a FastifyReply object.
     */
    public async microsoftCallback(
        @Query() cbQuery: CallbackQueryDto,
        @Res() res: FastifyReply,
    ): Promise<FastifyReply> {
        const provider = OAuthProvidersEnum.MICROSOFT;
        const { displayName, mail, tokens } =
            await this.oauth2Service.getUserData<IMicrosoftUser>(
                provider,
                cbQuery,
            );
        return this.loginAndRedirect(res, provider, mail, displayName, tokens);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.GOOGLE))
    @Get("google")
    @ApiResponse({
        description: "Redirects to Google OAuth2 login page",
        status: HttpStatus.TEMPORARY_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for Google",
    })

    /**
     * The function redirects the user to the Google OAuth provider.
     * @param {FastifyReply} res - The `res` parameter is an object representing
     * the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a class provided by the Fastify framework for
     * handling HTTP responses.
     * @returns the result of the `startRedirect` method with the `res` parameter
     * and the `OAuthProvidersEnum.GOOGLE` argument.
     */
    public google(@Res() res: FastifyReply): FastifyReply {
        return this.startRedirect(res, OAuthProvidersEnum.GOOGLE);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.GOOGLE))
    @Get("google/callback")
    @ApiResponse({
        description: "Redirects to the frontend with the JWT token",
        status: HttpStatus.PERMANENT_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for Google",
    })

    /**
     * The `googleCallback` function handles the callback from Google OAuth,
     * retrieves user data, and then logs in the user and redirects them.
     * @param {CallbackQueryDto} cbQuery - The `cbQuery` parameter is of type
     * `CallbackQueryDto`. It is used to retrieve the callback query data from the
     * request. It likely contains information such as the user's ID, message ID,
     * and data associated with the callback query.
     * @param {FastifyReply} res - The `res` parameter is the response object that
     * is used to send the response back to the client. It is of type
     * `FastifyReply`, which is a response object provided by the Fastify
     * framework.
     * @returns a Promise that resolves to a FastifyReply object.
     */
    public async googleCallback(
        @Query() cbQuery: CallbackQueryDto,
        @Res() res: FastifyReply,
    ): Promise<FastifyReply> {
        const provider = OAuthProvidersEnum.GOOGLE;
        const { name, email, tokens } =
            await this.oauth2Service.getUserData<IGoogleUser>(
                provider,
                cbQuery,
            );
        return this.loginAndRedirect(res, provider, email, name, tokens);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.FACEBOOK))
    @Get("facebook")
    @ApiResponse({
        description: "Redirects to Facebook OAuth2 login page",
        status: HttpStatus.TEMPORARY_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for Facebook",
    })

    /**
     * The function redirects the user to the Facebook OAuth provider.
     * @param {FastifyReply} res - The `res` parameter is an object that
     * represents the HTTP response. It is typically used to send the response
     * back to the client. In this case, it is of type `FastifyReply`, which is a
     * response object specific to the Fastify framework.
     * @returns the result of the `startRedirect` method with the `res` parameter
     * and the `OAuthProvidersEnum.FACEBOOK` argument.
     */
    public facebook(@Res() res: FastifyReply): FastifyReply {
        return this.startRedirect(res, OAuthProvidersEnum.FACEBOOK);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.FACEBOOK))
    @Get("facebook/callback")
    @ApiResponse({
        description: "Redirects to the frontend with the JWT token",
        status: HttpStatus.PERMANENT_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for Facebook",
    })

    /**
     * The `facebookCallback` function handles the callback from Facebook OAuth,
     * retrieves user data, and then logs in the user and redirects them.
     * @param {CallbackQueryDto} cbQuery - The `cbQuery` parameter is of type
     * `CallbackQueryDto` and it represents the callback query received from
     * Facebook after the user has authorized the application.
     * @param {FastifyReply} res - The `res` parameter is an object that
     * represents the response object in Fastify. It is used to send the response
     * back to the client.
     * @returns a Promise that resolves to a FastifyReply object.
     */
    public async facebookCallback(
        @Query() cbQuery: CallbackQueryDto,
        @Res() res: FastifyReply,
    ): Promise<FastifyReply> {
        const provider = OAuthProvidersEnum.FACEBOOK;
        const { name, email, tokens } =
            await this.oauth2Service.getUserData<IFacebookUser>(
                provider,
                cbQuery,
            );
        return this.loginAndRedirect(res, provider, email, name, tokens);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.GITHUB))
    @Get("github")
    @ApiResponse({
        description: "Redirects to GitHub OAuth2 login page",
        status: HttpStatus.TEMPORARY_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for GitHub",
    })

    /**
     * The function redirects the user to the GitHub OAuth provider.
     * @param {FastifyReply} res - The `res` parameter is an object representing
     * the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a class provided by the Fastify framework for
     * handling HTTP responses.
     * @returns the result of the `startRedirect` method with the `res` and
     * `OAuthProvidersEnum.GITHUB` parameters.
     */
    public github(@Res() res: FastifyReply): FastifyReply {
        return this.startRedirect(res, OAuthProvidersEnum.GITHUB);
    }

    @Public()
    @UseGuards(OAuthFlagGuard(OAuthProvidersEnum.GITHUB))
    @Get("github/callback")
    @ApiResponse({
        description: "Redirects to the frontend with the JWT token",
        status: HttpStatus.PERMANENT_REDIRECT,
    })
    @ApiNotFoundResponse({
        description: "OAuth2 is not enabled for GitHub",
    })

    /**
     * The `githubCallback` function handles the callback from GitHub OAuth
     * authentication, retrieves user data, and then logs in the user and
     * redirects them.
     * @param {CallbackQueryDto} cbQuery - The `cbQuery` parameter is of type
     * `CallbackQueryDto`. It represents the callback query received from the
     * user. It contains information such as the query ID, the user who sent the
     * query, and the data associated with the query.
     * @param {FastifyReply} res - The `res` parameter is the response object that
     * is used to send the response back to the client. It is of type
     * `FastifyReply`, which is a response object provided by the Fastify
     * framework.
     * @returns a Promise that resolves to a FastifyReply object.
     */
    public async githubCallback(
        @Query() cbQuery: CallbackQueryDto,
        @Res() res: FastifyReply,
    ): Promise<FastifyReply> {
        const provider = OAuthProvidersEnum.GITHUB;
        const { name, email, tokens } =
            await this.oauth2Service.getUserData<IGitHubUser>(
                provider,
                cbQuery,
            );
        return this.loginAndRedirect(res, provider, email, name, tokens);
    }

    /**
     * The function starts a redirect by setting the response status to temporary
     * redirect and redirecting to the authorization URL for the specified OAuth
     * provider.
     * @param {FastifyReply} res - The `res` parameter is an instance of the
     * `FastifyReply` class, which represents the response object in Fastify. It
     * is used to send the response back to the client.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * value that represents the OAuth provider for which you want to generate the
     * authorization URL.
     * @returns a FastifyReply object.
     */
    private startRedirect(
        res: FastifyReply,
        provider: OAuthProvidersEnum,
    ): FastifyReply {
        return res
            .status(HttpStatus.TEMPORARY_REDIRECT)
            .redirect(this.oauth2Service.getAuthorizationUrl(provider));
    }

    /**
     * The function logs in a user with OAuth credentials and redirects them to a
     * specified URL with access and refresh tokens.
     * @param {FastifyReply} res - The `res` parameter is the response object from
     * the Fastify server. It is used to send the response back to the client.
     * @param {OAuthProvidersEnum} provider - The `provider` parameter is an enum
     * that represents the OAuth provider being used for authentication. It could
     * be one of the following values:
     * @param {string} email - The `email` parameter is a string that represents
     * the user's email address.
     * @param {string} name - The `name` parameter is a string that represents the
     * name of the user.
     * @param {IAuthResponseTokensInterface} tokens - The `tokens` parameter is an
     * object that contains the access token and refresh token obtained from the
     * OAuth provider. It has the following structure:
     * @returns a FastifyReply object.
     */
    private async loginAndRedirect(
        res: FastifyReply,
        provider: OAuthProvidersEnum,
        email: string,
        name: string,
        tokens: IAuthResponseTokensInterface,
    ): Promise<FastifyReply> {
        const [accessToken, refreshToken] = await this.oauth2Service.login(
            provider,
            email,
            name,
            tokens,
        );
        return res
            .cookie(this.cookieName, refreshToken, {
                secure: !this.testing,
                httpOnly: false,
                signed: false,
                path: this.cookiePath,
                expires: new Date(Date.now() + this.refreshTime * 1000),
            })
            .status(HttpStatus.PERMANENT_REDIRECT)
            .redirect(
                `${this.url}/oauth/?access_token=${accessToken}&refresh_token=${refreshToken}`,
            );
    }
}
