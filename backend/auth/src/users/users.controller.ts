/*
File Name: users.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for users

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
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Res,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { UsersService } from "./users.service";
import { ConfigService } from "@nestjs/config";
import { PasswordDto } from "./dtos/password.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { GetUserParams } from "./dtos/get-user.params";
import { ChangeEmailDto } from "./dtos/change-email.dto";
import { Public } from "../auth/decorators/public.decorator";
import { ResponseUserMapper } from "./mappers/response-user.mapper";
import { IResponseUser } from "./interfaces/response-user.interface";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthResponseUserMapper } from "../auth/mappers/auth-response-user.mapper";
import { IAuthResponseUser } from "../auth/interfaces/auth-response-user.interface";

/* The UsersController class is a controller for handling user-related API
endpoints, such as retrieving user information, updating user details, changing
email, and deleting a user. */
@ApiTags("Users")
@Controller("api/users")
export class UsersController {
    private cookiePath = "/api/auth";
    private cookieName: string;

    /**
     * The constructor initializes private variables for the UsersService and
     * ConfigService, and assigns the value of the "REFRESH_COOKIE" configuration
     * property to the cookieName variable.
     * @param {UsersService} usersService - The usersService parameter is an
     * instance of the UsersService class. It is used to interact with the users
     * data and perform operations such as creating, updating, and deleting users.
     * @param {ConfigService} configService - The `configService` parameter is an
     * instance of the `ConfigService` class. It is used to retrieve configuration
     * values from a configuration file or environment variables. In this case, it
     * is used to get the value of the "REFRESH_COOKIE" configuration property,
     * which is expected to be a string
     */
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {
        this.cookieName = this.configService.get<string>("REFRESH_COOKIE");
    }

    @Public()
    @Get("/:idOrUsername")
    @ApiOkResponse({
        type: ResponseUserMapper,
        description: "The user is found and returned.",
    })
    @ApiBadRequestResponse({
        description: "Something is invalid on the request body",
    })
    @ApiNotFoundResponse({
        description: "The user is not found.",
    })

    /**
     * The function `getUser` retrieves a user by their ID or username and returns
     * a mapped response object.
     * @param {GetUserParams} params - The `params` parameter is of type
     * `GetUserParams`. It is used to pass the necessary information to the
     * `getUser` method.
     * @returns a Promise that resolves to an object of type IResponseUser.
     */
    public async getUser(
        @Param() params: GetUserParams,
    ): Promise<IResponseUser> {
        const user = await this.usersService.findOneByIdOrUsername(
            params.idOrUsername,
        );
        return ResponseUserMapper.map(user);
    }

    @Patch()
    @ApiOkResponse({
        type: ResponseUserMapper,
        description: "The username is updated.",
    })
    @ApiBadRequestResponse({
        description: "Something is invalid on the request body.",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not logged in.",
    })

    /**
     * The updateUser function updates a user's information and returns the
     * updated user.
     * @param {number} id - The `id` parameter is the current user's ID. It is
     * obtained using the `@CurrentUser()` decorator, which is likely implemented
     * in the framework you are using. This decorator retrieves the ID of the
     * currently authenticated user.
     * @param {UpdateUserDto} dto - The `dto` parameter is of type
     * `UpdateUserDto`, which is an object containing the updated user
     * information. It is passed in the request body and is used to update the
     * user in the database.
     * @returns a Promise that resolves to an object of type IResponseUser.
     */
    public async updateUser(
        @CurrentUser() id: number,
        @Body() dto: UpdateUserDto,
    ): Promise<IResponseUser> {
        const user = await this.usersService.update(id, dto);
        return ResponseUserMapper.map(user);
    }

    @Patch("/email")
    @ApiOkResponse({
        type: AuthResponseUserMapper,
        description: "The email is updated, and the user is returned.",
    })
    @ApiBadRequestResponse({
        description:
            "Something is invalid on the request body, or wrong password.",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not logged in.",
    })

    /**
     * The function updates the email of a user and returns the updated user as an
     * authentication response.
     * @param {number} id - The `id` parameter is the current user's ID. It is
     * used to identify the user whose email needs to be updated.
     * @param {ChangeEmailDto} dto - The `dto` parameter is of type
     * `ChangeEmailDto`. It is an object that contains the new email address that
     * the user wants to update to.
     * @returns a Promise that resolves to an object of type IAuthResponseUser.
     */
    public async updateEmail(
        @CurrentUser() id: number,
        @Body() dto: ChangeEmailDto,
    ): Promise<IAuthResponseUser> {
        const user = await this.usersService.updateEmail(id, dto);
        return AuthResponseUserMapper.map(user);
    }

    @Delete()
    @ApiNoContentResponse({
        description: "The user is deleted.",
    })
    @ApiBadRequestResponse({
        description:
            "Something is invalid on the request body, or wrong password.",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not logged in.",
    })

    /**
     * The deleteUser function is an asynchronous function that deletes a user,
     * clears a cookie, and sends a response with a status code of NO_CONTENT.
     * @param {number} id - The `id` parameter is the current user's ID. It is
     * obtained from the `CurrentUser` decorator, which is used to inject the
     * current user's ID into the method.
     * @param {PasswordDto} dto - The `dto` parameter is of type `PasswordDto`. It
     * is used to pass the user's password information for authentication and
     * authorization purposes.
     * @param {FastifyReply} res - The `res` parameter is an object representing
     * the response that will be sent back to the client. It is of type
     * `FastifyReply`, which is a class provided by the Fastify framework for
     * handling HTTP responses.
     */
    public async deleteUser(
        @CurrentUser() id: number,
        @Body() dto: PasswordDto,
        @Res() res: FastifyReply,
    ): Promise<void> {
        await this.usersService.delete(id, dto);
        res.clearCookie(this.cookieName, { path: this.cookiePath })
            .status(HttpStatus.NO_CONTENT)
            .send();
    }
}
