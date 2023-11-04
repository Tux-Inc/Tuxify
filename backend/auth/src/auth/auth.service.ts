/*
File Name: auth.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for authentification and authorization

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
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import dayjs from "dayjs";
import { compare } from "bcrypt";
import { Cache } from "cache-manager";
import { isEmail } from "class-validator";
import { EmailDto } from "./dtos/email.dto";
import { SignInDto } from "./dtos/sign-in.dto";
import { SignUpDto } from "./dtos/sign-up.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "../jwt/jwt.service";
import { ClientProxy } from "@nestjs/microservices";
import { RpcException } from "@nestjs/microservices";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UsersService } from "../users/users.service";
import { CommonService } from "../common/common.service";
import { SLUG_REGEX } from "../common/consts/regex.const";
import { UserEntity } from "../users/entities/user.entity";
import { ConfirmEmailDto } from "./dtos/confirm-email.dto";
import { TokenTypeEnum } from "../jwt/enums/token-type.enum";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { IAuthResult } from "./interfaces/auth-result.interface";
import { IMessage } from "../common/interfaces/message.interface";
import { UserResetPasswordDto } from "./dtos/user-reset-password.dto";
import { isNull, isUndefined } from "../common/utils/validation.util";
import { IEmailToken } from "../jwt/interfaces/email-token.interface";
import { OAuthProvidersEnum } from "../users/enums/oauth-providers.enum";
import { ICredentials } from "../users/interfaces/credentials.interface";
import { IRefreshToken } from "../jwt/interfaces/refresh-token.interface";

/* The AuthService class is responsible for handling user authentication and
authorization, including sign up, sign in, token verification, password reset,
and password update. */
@Injectable()
export class AuthService {
    /**
     * The constructor function initializes various dependencies for the class.
     * @param {Cache} cacheManager - The `cacheManager` parameter is an instance
     * of the `Cache` class. It is used for managing caching operations.
     * @param {CommonService} commonService - The `commonService` parameter is an
     * instance of the `CommonService` class. It is used to access common
     * functionalities or services that are shared across different parts of the
     * application.
     * @param {UsersService} usersService - The `usersService` parameter is an
     * instance of the `UsersService` class. It is used to interact with the users
     * in the application, such as retrieving user information, creating new
     * users, updating user details, etc.
     * @param {JwtService} jwtService - The `jwtService` parameter is an instance
     * of the `JwtService` class. It is used for handling JSON Web Tokens (JWT) in
     * the application. JWTs are used for authentication and authorization
     * purposes.
     * @param {ConfigService} configService - An instance of the ConfigService
     * class, which is used to access configuration values in the application.
     * @param {ClientProxy} mailerClient - The `mailerClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator with the token
     * `"MAILER_SERVICE"`. It is used to communicate with a mailer service for
     * sending emails.
     */
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly commonService: CommonService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject("MAILER_SERVICE") private readonly mailerClient: ClientProxy,
    ) {}

    /**
     * The function `verifyJwt` takes a JWT token as input, verifies it using a
     * JWT service, and returns the ID extracted from the token.
     * @param {string} token - The `token` parameter is a string that represents a
     * JSON Web Token (JWT).
     * @returns the `id` extracted from the verified token.
     */
    public async verifyJwt(token: string): Promise<number> {
        try {
            const { id } = await this.jwtService.verifyToken(
                token,
                TokenTypeEnum.ACCESS,
            );
            return id;
        } catch (error) {
            throw new RpcException(error.message);
        }
    }

    /**
     * The signUp function creates a new user, generates a confirmation token,
     * sends a confirmation email, and returns a success message.
     * @param {SignUpDto} dto - The `dto` parameter is an object that contains the
     * following properties:
     * @param {string} [domain] - The `domain` parameter is an optional string
     * that represents the domain name of the application. It is used to generate
     * the confirmation link for the user's email confirmation. If provided, it
     * will be included in the confirmation link URL.
     * @returns a Promise that resolves to an IMessage object.
     */
    public async signUp(dto: SignUpDto, domain?: string): Promise<IMessage> {
        const { name, email, password1, password2 } = dto;
        this.comparePasswords(password1, password2);
        const user: UserEntity = await this.usersService.create(
            OAuthProvidersEnum.LOCAL,
            email,
            name,
            password1,
        );
        const confirmationToken = await this.jwtService.generateToken(
            user,
            TokenTypeEnum.CONFIRMATION,
            domain,
        );
        const createdUserDto = {
            email: user.email,
            confirmationLink: `${this.configService.get<string>(
                "domain",
            )}/auth/confirm-email?token=${confirmationToken}`,
        };
        this.mailerClient.emit("user.created", createdUserDto);
        return this.commonService.generateMessage("Registration successful");
    }

    /**
     * The `confirmEmail` function takes in a confirmation token, verifies it,
     * confirms the user's email, generates authentication tokens, and returns the
     * user, access token, and refresh token.
     * @param {ConfirmEmailDto} dto - The `dto` parameter is an object of type
     * `ConfirmEmailDto`. It contains the confirmation token needed to confirm the
     * user's email.
     * @param {string} [domain] - The `domain` parameter is an optional string
     * that represents the domain of the website or application where the email
     * confirmation is being performed. It is used when generating authentication
     * tokens (access token and refresh token) for the user. If provided, the
     * tokens will be associated with the specified domain.
     * @returns an object of type `IAuthResult`. The object contains the
     * properties `user`, `accessToken`, and `refreshToken`.
     */
    public async confirmEmail(
        dto: ConfirmEmailDto,
        domain?: string,
    ): Promise<IAuthResult> {
        const { confirmationToken } = dto;
        const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
            confirmationToken,
            TokenTypeEnum.CONFIRMATION,
        );
        const user = await this.usersService.confirmEmail(id, version);
        const [accessToken, refreshToken] =
            await this.jwtService.generateAuthTokens(user, domain);
        return { user, accessToken, refreshToken };
    }

    /**
     * The `signIn` function is used to authenticate a user by comparing their
     * provided email/username and password with the stored credentials, and
     * generating access and refresh tokens if the authentication is successful.
     * @param {SignInDto} dto - The `dto` parameter is an object of type
     * `SignInDto` which contains the following properties:
     * @param {string} [domain] - The `domain` parameter is an optional string
     * that represents the domain of the application. It is used to generate the
     * confirmation link for the user's email and to generate authentication
     * tokens. If provided, it will be included in the confirmation link and used
     * to sign the tokens.
     * @returns an object of type `IAuthResult` which contains the properties
     * `user`, `accessToken`, and `refreshToken`.
     */
    public async signIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
        const { emailOrUsername, password } = dto;
        const user = await this.userByEmailOrUsername(emailOrUsername);

        if (!(await compare(password, user.password))) {
            await this.checkLastPassword(user.credentials, password);
        }
        if (!user.confirmed) {
            const confirmationToken = await this.jwtService.generateToken(
                user,
                TokenTypeEnum.CONFIRMATION,
                domain,
            );
            const createdUserDto = {
                email: user.email,
                confirmationLink: `${this.configService.get<string>(
                    "domain",
                )}/auth/confirm-email?token=${confirmationToken}`,
            };
            this.mailerClient.emit("user.created", createdUserDto);
            throw new UnauthorizedException(
                "Please confirm your email, a new email has been sent",
            );
        }

        const [accessToken, refreshToken] =
            await this.jwtService.generateAuthTokens(user, domain);
        return { user, accessToken, refreshToken };
    }

    /**
     * The function refreshTokenAccess takes a refresh token, verifies it, checks
     * if it is blacklisted, finds the user associated with the token, generates
     * new access and refresh tokens, and returns the user along with the new
     * tokens.
     * @param {string} refreshToken - A string representing the refresh token that
     * needs to be refreshed.
     * @param {string} [domain] - The "domain" parameter is an optional string
     * that represents the domain or origin of the request. It is used to generate
     * the access and refresh tokens with the appropriate audience claim, which
     * can be useful for security purposes. If not provided, the tokens will be
     * generated without an audience claim.
     * @returns an object of type `IAuthResult`. The object contains the following
     * properties:
     */
    public async refreshTokenAccess(
        refreshToken: string,
        domain?: string,
    ): Promise<IAuthResult> {
        const { id, version, tokenId } =
            await this.jwtService.verifyToken<IRefreshToken>(
                refreshToken,
                TokenTypeEnum.REFRESH,
            );
        await this.checkIfTokenIsBlacklisted(id, tokenId);
        const user = await this.usersService.findOneByCredentials(id, version);
        const [accessToken, newRefreshToken] =
            await this.jwtService.generateAuthTokens(user, domain, tokenId);
        return { user, accessToken, refreshToken: newRefreshToken };
    }

    /**
     * The `logout` function logs out a user by blacklisting their refresh token
     * and returns a success message.
     * @param {string} refreshToken - A string representing the refresh token used
     * for authentication.
     * @returns a Promise that resolves to an object of type `IMessage`.
     */
    public async logout(refreshToken: string): Promise<IMessage> {
        const { id, tokenId, exp } =
            await this.jwtService.verifyToken<IRefreshToken>(
                refreshToken,
                TokenTypeEnum.REFRESH,
            );
        await this.blacklistToken(id, tokenId, exp);
        return this.commonService.generateMessage("Logout successful");
    }

    /**
     * The function sends a reset password email to a user with a generated reset
     * token.
     * @param {EmailDto} dto - The `dto` parameter is an object of type
     * `EmailDto`. It contains the email address of the user for whom the password
     * reset email needs to be sent.
     * @param {string} [domain] - The `domain` parameter is an optional string
     * that represents the domain name of the application. It is used to generate
     * the reset password link that will be sent to the user's email. If the
     * `domain` parameter is provided, it will be included in the reset password
     * link. If it is not
     * @returns a Promise that resolves to an IMessage object.
     */
    public async resetPasswordEmail(
        dto: EmailDto,
        domain?: string,
    ): Promise<IMessage> {
        const user = await this.usersService.uncheckedUserByEmail(dto.email);

        if (!isUndefined(user) && !isNull(user)) {
            const resetToken = await this.jwtService.generateToken(
                user,
                TokenTypeEnum.RESET_PASSWORD,
                domain,
            );
            const userResetPasswordDto: UserResetPasswordDto = {
                email: user.email,
                resetLink: `${this.configService.get<string>(
                    "domain",
                )}/auth/reset-password?token=${resetToken}`,
            };
            this.mailerClient.emit("user.reset_password", userResetPasswordDto);
        }

        return this.commonService.generateMessage("Reset password email sent");
    }

    /**
     * The `resetPassword` function resets a user's password using a reset token
     * and returns a success message.
     * @param {ResetPasswordDto} dto - The `dto` parameter is an object of type
     * `ResetPasswordDto`. It contains the following properties:
     * @returns a Promise of type `IMessage`.
     */
    public async resetPassword(dto: ResetPasswordDto): Promise<IMessage> {
        const { password1, password2, resetToken } = dto;
        const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
            resetToken,
            TokenTypeEnum.RESET_PASSWORD,
        );
        this.comparePasswords(password1, password2);
        await this.usersService.resetPassword(id, version, password1);
        return this.commonService.generateMessage(
            "Password reset successfully",
        );
    }

    /**
     * The function updates a user's password, generates new authentication
     * tokens, and returns the updated user along with the tokens.
     * @param {number} userId - The userId parameter is the unique identifier of
     * the user whose password needs to be updated.
     * @param {ChangePasswordDto} dto - The `dto` parameter is an object of type
     * `ChangePasswordDto` which contains the following properties:
     * @param {string} [domain] - The "domain" parameter is an optional string
     * that represents the domain or subdomain of the website or application where
     * the password update is being performed. It is used by the
     * "generateAuthTokens" method of the "jwtService" to generate the access and
     * refresh tokens for the user. If the "
     * @returns an object of type `IAuthResult` which contains the properties
     * `user`, `accessToken`, and `refreshToken`.
     */
    public async updatePassword(
        userId: number,
        dto: ChangePasswordDto,
        domain?: string,
    ): Promise<IAuthResult> {
        const { password1, password2, password } = dto;
        this.comparePasswords(password1, password2);
        const user = await this.usersService.updatePassword(
            userId,
            password1,
            password,
        );
        const [accessToken, refreshToken] =
            await this.jwtService.generateAuthTokens(user, domain);
        return { user, accessToken, refreshToken };
    }

    /**
     * The function `checkLastPassword` checks if the provided password matches
     * the last password used and throws an exception if it is invalid or if the
     * password was changed recently.
     * @param {ICredentials} credentials - The `credentials` parameter is an
     * object that contains information about the user's credentials. It likely
     * includes properties such as `lastPassword` (the user's previous password)
     * and `passwordUpdatedAt` (the timestamp when the password was last updated).
     * @param {string} password - The `password` parameter is a string that
     * represents the user's current password.
     */
    private async checkLastPassword(
        credentials: ICredentials,
        password: string,
    ): Promise<void> {
        const { lastPassword, passwordUpdatedAt } = credentials;

        if (
            lastPassword.length === 0 ||
            !(await compare(password, lastPassword))
        ) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const now = dayjs();
        const time = dayjs.unix(passwordUpdatedAt);
        const months = now.diff(time, "month");
        const message = "You changed your password ";

        if (months > 0) {
            throw new UnauthorizedException(
                message + months + (months > 1 ? " months ago" : " month ago"),
            );
        }

        const days = now.diff(time, "day");

        if (days > 0) {
            throw new UnauthorizedException(
                message + days + (days > 1 ? " days ago" : " day ago"),
            );
        }

        const hours = now.diff(time, "hour");

        if (hours > 0) {
            throw new UnauthorizedException(
                message + hours + (hours > 1 ? " hours ago" : " hour ago"),
            );
        }

        throw new UnauthorizedException(message + "recently");
    }

    /**
     * The function checks if a token is blacklisted for a specific user and
     * throws an exception if it is.
     * @param {number} userId - The `userId` parameter is a number that represents
     * the user's ID. It is used to identify the user whose token needs to be
     * checked.
     * @param {string} tokenId - The `tokenId` parameter is a string that
     * represents the unique identifier of a token.
     */
    private async checkIfTokenIsBlacklisted(
        userId: number,
        tokenId: string,
    ): Promise<void> {
        const time = await this.cacheManager.get<number>(
            `blacklist:${userId}:${tokenId}`,
        );

        if (!isUndefined(time) && !isNull(time)) {
            throw new UnauthorizedException("Invalid token");
        }
    }

    /**
     * The function `blacklistToken` takes in a user ID, token ID, and expiration
     * time, and blacklists the token if it has not expired.
     * @param {number} userId - The `userId` parameter is a number that represents
     * the unique identifier of the user whose token is being blacklisted.
     * @param {string} tokenId - The `tokenId` parameter is a string that
     * represents the unique identifier of a token.
     * @param {number} exp - The `exp` parameter represents the expiration time of
     * the token in Unix timestamp format. It indicates the time when the token
     * will no longer be valid.
     */
    private async blacklistToken(
        userId: number,
        tokenId: string,
        exp: number,
    ): Promise<void> {
        const now = dayjs().unix();
        const ttl = (exp - now) * 1000;

        if (ttl > 0) {
            await this.commonService.throwInternalError(
                this.cacheManager.set(
                    `blacklist:${userId}:${tokenId}`,
                    now,
                    ttl,
                ),
            );
        }
    }

    /**
     * The function compares two passwords and throws an exception if they do not
     * match.
     * @param {string} password1 - The first password to compare.
     * @param {string} password2 - The `password2` parameter is the second
     * password that needs to be compared with `password1` to check if they match.
     */
    private comparePasswords(password1: string, password2: string): void {
        if (password1 !== password2) {
            throw new BadRequestException("Passwords do not match");
        }
    }

    /**
     * The function `userByEmailOrUsername` takes an email or username as input
     * and returns a user entity based on the input.
     * @param {string} emailOrUsername - A string representing either an email
     * address or a username.
     * @returns a Promise that resolves to a UserEntity object.
     */
    private async userByEmailOrUsername(
        emailOrUsername: string,
    ): Promise<UserEntity> {
        if (emailOrUsername.includes("@")) {
            if (!isEmail(emailOrUsername)) {
                throw new BadRequestException("Invalid email");
            }

            return this.usersService.findOneByEmail(emailOrUsername);
        }

        if (
            emailOrUsername.length < 3 ||
            emailOrUsername.length > 106 ||
            !SLUG_REGEX.test(emailOrUsername)
        ) {
            throw new BadRequestException("Invalid username");
        }

        return this.usersService.findOneByUsername(emailOrUsername, true);
    }
}
