/*
File Name: auth.guard.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Guard to check if the user is authenticated

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
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isJWT } from "class-validator";
import { FastifyRequest } from "fastify";
import { isNull, isUndefined } from "../../common/utils/validation.util";
import { TokenTypeEnum } from "../../jwt/enums/token-type.enum";
import { JwtService } from "../../jwt/jwt.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

/* The AuthGuard class is a TypeScript class that implements the CanActivate
interface and is responsible for checking if a request is authorized to access
a particular route based on the presence and validity of a JWT token in the
request header. */
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * The constructor function takes in a reflector and jwtService as parameters
     * and assigns them to private readonly properties.
     * @param {Reflector} reflector - The `reflector` parameter is of type
     * `Reflector`. It is likely used for reflection purposes, such as retrieving
     * metadata or annotations from classes, methods, or properties at runtime.
     * @param {JwtService} jwtService - The `jwtService` parameter is an instance
     * of the `JwtService` class. It is used for handling JSON Web Tokens (JWTs)
     * in the application. JWTs are used for authentication and authorization
     * purposes. The `JwtService` class provides methods for generating, signing,
     * and verifying JWTs
     */
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * The `canActivate` function checks if a request is public or not and sets an
     * HTTP header accordingly, and throws an UnauthorizedException if the request
     * is not activated.
     * @param {ExecutionContext} context - The `context` parameter is an instance
     * of the `ExecutionContext` class. It represents the current execution
     * context of the request being processed. It provides access to various
     * information and methods related to the current request, such as the request
     * object, response object, route handler, and more.
     * @returns a Promise that resolves to a boolean value.
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        const activate = await this.setHttpHeader(
            context.switchToHttp().getRequest<FastifyRequest>(),
            isPublic,
        );

        if (!activate) {
            throw new UnauthorizedException();
        }

        return activate;
    }

    /**
     * The function `setHttpHeader` checks the authorization header in a Fastify
     * request, verifies the JWT token, and sets the user ID in the request object
     * if the token is valid.
     * @param {FastifyRequest} req - The `req` parameter is of type
     * `FastifyRequest`, which represents the incoming HTTP request object in
     * Fastify framework.
     * @param {boolean} isPublic - A boolean value indicating whether the endpoint
     * is public or requires authentication. If it is true, it means the endpoint
     * is public and no authentication is required. If it is false, it means the
     * endpoint requires authentication.
     * @returns a Promise<boolean>.
     */
    private async setHttpHeader(
        req: FastifyRequest,
        isPublic: boolean,
    ): Promise<boolean> {
        const auth = req.headers?.authorization;

        if (isUndefined(auth) || isNull(auth) || auth.length === 0) {
            return isPublic;
        }

        const authArr = auth.split(" ");
        const bearer = authArr[0];
        const token = authArr[1];

        if (isUndefined(bearer) || isNull(bearer) || bearer !== "Bearer") {
            return isPublic;
        }
        if (isUndefined(token) || isNull(token) || !isJWT(token)) {
            return isPublic;
        }

        try {
            const { id } = await this.jwtService.verifyToken(
                token,
                TokenTypeEnum.ACCESS,
            );
            req.user = id;
            return true;
        } catch (_) {
            return isPublic;
        }
    }
}
