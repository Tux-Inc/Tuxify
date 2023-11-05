/*
File Name: auth.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for auth

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
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { EmailDto } from "./dtos/email.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dtos/sign-in.dto";
import { SignUpDto } from "./dtos/sign-up.dto";
import { UsersService } from "../users/users.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { Origin } from "./decorators/origin.decorator";
import { Public } from "./decorators/public.decorator";
import { ConfirmEmailDto } from "./dtos/confirm-email.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MessageMapper } from "../common/mappers/message.mapper";
import { CurrentUser } from "./decorators/current-user.decorator";
import { IMessage } from "../common/interfaces/message.interface";
import { AuthResponseMapper } from "./mappers/auth-response.mapper";
import { isNull, isUndefined } from "../common/utils/validation.util";
// import { FastifyThrottlerGuard } from './guards/fastify-throttler.guard';
import { AuthResponseUserMapper } from "./mappers/auth-response-user.mapper";
import { IAuthResponseUser } from "./interfaces/auth-response-user.interface";
import { OAuthProvidersResponseMapper } from "./mappers/oauth-provider-response.mapper";
import { IOAuthProvidersResponse } from "./interfaces/oauth-provider-response.interface";

/* The AuthController class handles authentication-related API endpoints and their
corresponding logic. */
@ApiTags("Auth")
@Controller("api/auth")
// @UseGuards(FastifyThrottlerGuard)
export class AuthController {
    private readonly cookiePath = "/api/auth";
    private readonly cookieName: string;
    private readonly refreshTime: number;
    private readonly testing: boolean;

    /**
     * The constructor initializes private variables using values from the
     * authService, usersService, configService, and sets the cookieName,
     * refreshTime, and testing properties.
     * @param {AuthService} authService - The `authService` parameter is an
     * instance of the `AuthService` class. It is used for handling
     * authentication-related operations, such as generating and verifying JWT
     * tokens.
     * @param {UsersService} usersService - The `usersService` parameter is an
     * instance of the `UsersService` class. It is used to interact with the user
     * data and perform operations such as creating, updating, and deleting users.
     * @param {ConfigService} configService - The `configService` parameter is an
     * instance of the `ConfigService` class. It is used to retrieve configuration
     * values from a configuration file or environment variables. In this code
     * snippet, it is used to get the values of the `REFRESH_COOKIE`,
     * `jwt.refresh.time`, and `testing`
     */
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {
        this.cookieName = this.configService.get<string>("REFRESH_COOKIE");
        this.refreshTime = this.configService.get<number>("jwt.refresh.time");
        this.testing = this.configService.get<boolean>("testing");
    }

    @MessagePattern("auth.jwt.verify")
    public async verifyJwt(@Payload() token: string): Promise<number> {
        return this.authService.verifyJwt(token);
    }

    @Public()
    @Post("/sign-up")
    @ApiCreatedResponse({
        type: MessageMapper,
        description: "The user has been created and is waiting confirmation",
    })
    @ApiConflictResponse({
        description: "Email already in use",
    })
    @ApiBadRequestResponse({
        description: "Something is invalid on the request body",
    })

    /**
     * The signUp function is an asynchronous function that takes in an origin and
     * a signUpDto object, and returns a Promise that resolves to an IMessage
     * object.
     * @param {string | undefined} origin - The `origin` parameter is a string
     * that represents the origin from where the sign-up request is being made. It
     * can be either a valid URL or undefined if the origin is not provided.
     * @param {SignUpDto} signUpDto - The signUpDto parameter is of type
     * SignUpDto, which is likely an interface or class representing the data
     * required for a user to sign up. It contains properties such as username,
     * email, password, etc.
     * @returns The `signUp` method is returning a `Promise` that resolves to an
     * `IMessage` object.
     */
    public async signUp(
        @Origin() origin: string | undefined,
        @Body() signUpDto: SignUpDto,
    ): Promise<IMessage> {
        return await this.authService.signUp(signUpDto, origin);
    }

    @Public()
    @Post("/sign-in")
    @ApiOkResponse({
        type: AuthResponseMapper,
        description: "Logs in the user and returns the access token",
    })
    @ApiBadRequestResponse({
        description: "Something is invalid on the request body",
    })
    @ApiUnauthorizedResponse({
        description: "Invalid credentials or User is not confirmed",
    })

    /**
     * The `signIn` function is an asynchronous function that handles user sign-in
     * requests, and it sends the response with the result of the sign-in
     * operation.
     * @param {FastifyReply} res - The `res` parameter is the response object from
     * the Fastify framework. It is used to send the HTTP response back to the
     * client.
     * @param {string | undefined} origin - The `origin` parameter is a string
     * that represents the origin of the request. It is used to determine the
     * source of the request, such as the domain or IP address. In this code
     * snippet, it is passed as a parameter to the `signIn` method of the
     * `authService`.
     * @param {SignInDto} singInDto - The `singInDto` parameter is of type
     * `SignInDto`. It is an object that contains the data needed for the sign-in
     * process.
     */
    public async signIn(
        @Res() res: FastifyReply,
        @Origin() origin: string | undefined,
        @Body() singInDto: SignInDto,
    ): Promise<void> {
        const result = await this.authService.signIn(singInDto, origin);
        res.status(HttpStatus.OK).send(AuthResponseMapper.map(result));
    }

    @Public()
    @Post("/refresh-access")
    @ApiOkResponse({
        type: AuthResponseMapper,
        description: "Refreshes and returns the access token",
    })
    @ApiUnauthorizedResponse({
        description: "Invalid token",
    })
    @ApiBadRequestResponse({
        description:
            "Something is invalid on the request body, or Token is invalid or expired",
    })

    /**
     * The function `refreshAccess` is an asynchronous function that refreshes the
     * access token using the refresh token provided in the request, and sends the
     * updated access token back in the response.
     * @param {FastifyRequest} req - The `req` parameter is of type
     * `FastifyRequest`, which represents the incoming HTTP request. It contains
     * information about the request such as headers, query parameters, and
     * request body.
     * @param {FastifyReply} res - The `res` parameter is the response object that
     * is used to send the HTTP response back to the client. It is an instance of
     * the `FastifyReply` class, which provides methods for setting the response
     * status code, headers, and body. In this code snippet, the `res` object
     */
    public async refreshAccess(
        @Req() req: FastifyRequest,
        @Res() res: FastifyReply,
    ): Promise<void> {
        const token = this.refreshTokenFromReq(req);
        const result = await this.authService.refreshTokenAccess(
            token,
            req.headers.origin,
        );
        res.status(HttpStatus.OK).send(AuthResponseMapper.map(result));
    }

    @Post("/logout")
    @ApiOkResponse({
        type: MessageMapper,
        description: "The user is logged out",
    })
    @ApiBadRequestResponse({
        description: "Something is invalid on the request body",
    })
    @ApiUnauthorizedResponse({
        description: "Invalid token",
    })

    /**
     * The `logout` function logs out a user by invalidating their refresh token
     * and returning a JSON response.
     * @param {FastifyRequest} req - The `req` parameter is of type
     * `FastifyRequest`, which represents the incoming HTTP request. It contains
     * information about the request such as headers, query parameters, and
     * request body.
     * @param {FastifyReply} res - The `res` parameter is an object representing
     * the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a class provided by the Fastify framework for
     * handling HTTP responses.
     */
    public async logout(
        @Req() req: FastifyRequest,
        @Res() res: FastifyReply,
    ): Promise<void> {
        const token = this.refreshTokenFromReq(req);
        const message = await this.authService.logout(token);
        res.header("Content-Type", "application/json")
            .status(HttpStatus.OK)
            .send(message);
    }

    @Public()
    @Post("/confirm-email")
    @ApiOkResponse({
        type: AuthResponseMapper,
        description: "Confirms the user email and returns the access token",
    })
    @ApiUnauthorizedResponse({
        description: "Invalid token",
    })
    @ApiBadRequestResponse({
        description:
            "Something is invalid on the request body, or Token is invalid or expired",
    })

    /**
     * The `confirmEmail` function is an asynchronous function that takes in an
     * origin, a confirmEmailDto, and a response object, and it calls the
     * `confirmEmail` method of the `authService` with the confirmEmailDto, then
     * sends the mapped result as a response with a status code of 200.
     * @param {string | undefined} origin - The `origin` parameter is a string
     * that represents the origin from where the request is being made. It is
     * optional and can be either a valid URL or undefined.
     * @param {ConfirmEmailDto} confirmEmailDto - The `confirmEmailDto` parameter
     * is an object that contains the data needed to confirm an email. It likely
     * includes properties such as `userId` and `confirmationCode`.
     * @param {FastifyReply} res - The `res` parameter is an object that
     * represents the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a response object provided by the Fastify
     * framework. It is used to set the status code and send the response body to
     * the client. In
     */
    public async confirmEmail(
        @Origin() origin: string | undefined,
        @Body() confirmEmailDto: ConfirmEmailDto,
        @Res() res: FastifyReply,
    ): Promise<void> {
        const result = await this.authService.confirmEmail(confirmEmailDto);
        res.status(HttpStatus.OK).send(AuthResponseMapper.map(result));
    }

    @Public()
    @Post("/forgot-password")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: MessageMapper,
        description:
            "An email has been sent to the user with the reset password link",
    })

    /**
     * The `forgotPassword` function is an asynchronous function that sends a
     * reset password email using the `resetPasswordEmail` method from the
     * `authService` class.
     * @param {string | undefined} origin - The `origin` parameter is a string
     * that represents the origin or domain from which the request is being made.
     * It is used to ensure that the password reset email is sent from a trusted
     * source.
     * @param {EmailDto} emailDto - An object that contains the email address of
     * the user who wants to reset their password.
     * @returns The `forgotPassword` method is returning a `Promise` that resolves
     * to an `IMessage` object.
     */
    public async forgotPassword(
        @Origin() origin: string | undefined,
        @Body() emailDto: EmailDto,
    ): Promise<IMessage> {
        return this.authService.resetPasswordEmail(emailDto, origin);
    }

    @Public()
    @Post("/reset-password")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: MessageMapper,
        description: "The password has been reset",
    })
    @ApiBadRequestResponse({
        description:
            "Something is invalid on the request body, or Token is invalid or expired",
    })

    /**
     * The function `resetPassword` takes a `resetPasswordDto` object as input and
     * returns a promise that resolves to an `IMessage` object.
     * @param {ResetPasswordDto} resetPasswordDto - The `resetPasswordDto`
     * parameter is an object of type `ResetPasswordDto`. It is passed as the
     * request body and contains the necessary information for resetting a
     * password.
     * @returns a Promise of type IMessage.
     */
    public async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<IMessage> {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Patch("/update-password")
    @ApiOkResponse({
        type: AuthResponseMapper,
        description: "The password has been updated",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not logged in.",
    })

    /**
     * The function updates a user's password and sends a response with the
     * result.
     * @param {number} userId - The `userId` parameter is of type `number` and is
     * decorated with `@CurrentUser()`. This means that it represents the ID of
     * the currently authenticated user.
     * @param {string | undefined} origin - The `origin` parameter is a string
     * that represents the origin or source of the request. It is used to track
     * where the request is coming from. In this case, it is passed as an argument
     * to the `updatePassword` method.
     * @param {ChangePasswordDto} changePasswordDto - The `changePasswordDto`
     * parameter is an object that contains the data needed to update the
     * password. It likely has properties such as `currentPassword` and
     * `newPassword`, which are used to verify the user's current password and set
     * the new password, respectively.
     * @param {FastifyReply} res - The `res` parameter is an object that
     * represents the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a response object provided by the Fastify
     * framework.
     */
    public async updatePassword(
        @CurrentUser() userId: number,
        @Origin() origin: string | undefined,
        @Body() changePasswordDto: ChangePasswordDto,
        @Res() res: FastifyReply,
    ): Promise<void> {
        const result = await this.authService.updatePassword(
            userId,
            changePasswordDto,
            origin,
        );
        res.status(HttpStatus.OK).send(AuthResponseMapper.map(result));
    }

    @Get("/me")
    @ApiOkResponse({
        type: AuthResponseUserMapper,
        description: "The user is found and returned.",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not logged in.",
    })

    /**
     * The function `getMe` retrieves a user by their ID and returns a mapped
     * response object.
     * @param {number} id - The `id` parameter is of type `number` and is
     * decorated with `@CurrentUser()`. This decorator is used to inject the
     * current user's ID into the method.
     * @returns a Promise that resolves to an object of type IAuthResponseUser.
     */
    public async getMe(@CurrentUser() id: number): Promise<IAuthResponseUser> {
        const user = await this.usersService.findOneById(id);
        return AuthResponseUserMapper.map(user);
    }

    @Get("/providers")
    @ApiOkResponse({
        type: OAuthProvidersResponseMapper,
        description: "The OAuth providers are returned.",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not logged in.",
    })

    /**
     * The function `getOAuthProviders` retrieves OAuth providers for a user and
     * maps them to a response format.
     * @param {number} id - The `id` parameter is the current user's ID. It is
     * used to find the OAuth providers associated with the user.
     * @returns a Promise that resolves to an object of type
     * IOAuthProvidersResponse.
     */
    public async getOAuthProviders(
        @CurrentUser() id: number,
    ): Promise<IOAuthProvidersResponse> {
        const providers = await this.usersService.findOAuthProviders(id);
        return OAuthProvidersResponseMapper.map(providers);
    }

    /**
     * The function extracts and returns the token from the authorization header
     * of a request, throwing an UnauthorizedException if the token is undefined
     * or null.
     * @param {FastifyRequest} req - The parameter `req` is of type
     * `FastifyRequest`. It represents the incoming request object in a Fastify
     * server.
     * @returns a string value, which is the token extracted from the request
     * headers.
     */
    private refreshTokenFromReq(req: FastifyRequest): string {
        const token: string | undefined =
            req.headers.authorization?.split(" ")[1];

        if (isUndefined(token) || isNull(token)) {
            throw new UnauthorizedException();
        }

        return token;
    }

    /**
     * The function saves a refresh token as a cookie in the response and sets
     * additional cookie options.
     * @param {FastifyReply} res - The `res` parameter is the response object that
     * is returned by the Fastify server. It is used to set the response headers
     * and cookies.
     * @param {string} refreshToken - A string representing the refresh token that
     * needs to be saved as a cookie.
     * @returns a FastifyReply object.
     */
    private saveRefreshCookie(
        res: FastifyReply,
        refreshToken: string,
    ): FastifyReply {
        return res
            .cookie(this.cookieName, refreshToken, {
                secure: !this.testing,
                httpOnly: true,
                signed: true,
                path: this.cookiePath,
                expires: new Date(Date.now() + this.refreshTime * 1000),
            })
            .header("Content-Type", "application/json");
    }
}
