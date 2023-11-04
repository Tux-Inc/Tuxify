/*
File Name: auth.guard.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Guard for authentification file
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
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { firstValueFrom, Observable } from "rxjs";
import { ClientProxy, RpcException } from "@nestjs/microservices";

/* The AuthGuard class is a TypeScript class that implements the CanActivate
interface and is used to authenticate and authorize requests by extracting and
verifying a bearer token. */
@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    /**
     * The constructor function takes in a parameter named "natsClient" which is
     * of type "ClientProxy" and is annotated with the "@Inject" decorator.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is being injected using the `@Inject` decorator. It is
     * likely being used to establish a connection to a NATS messaging server.
     */
    constructor(@Inject("NATS_CLIENT") private natsClient: ClientProxy) {}

    /**
     * The `canActivate` function checks for a bearer token in the request,
     * extracts the user ID from the token, and assigns it to the `request.user`
     * property.
     * @param {ExecutionContext} context - The `context` parameter is an instance
     * of the `ExecutionContext` class. It provides information about the current
     * execution context, such as the type of the context (e.g., HTTP, RPC, etc.)
     * and the underlying request and response objects.
     * @returns The `canActivate` function returns a Promise<boolean>.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const bearerToken: string = this.extractBearerToken(request);

        if (!bearerToken) {
            this.logger.error("Bearer token not found");
            throw new UnauthorizedException("Bearer token not found");
        }
        let userId: number = null;
        try {
            userId = await firstValueFrom(this.getUserData(bearerToken));
        } catch (error) {
            throw new ForbiddenException(error);
        }

        if (!userId) {
            this.logger.error("Invalid bearer token");
            throw new ForbiddenException("Invalid bearer token");
        }

        request.user = userId;
        return true;
    }

    /**
     * The function extracts the bearer token from the authorization header of a
     * request.
     * @param {any} request - The `request` parameter is an object that represents
     * an HTTP request. It typically contains information such as headers, body,
     * query parameters, etc. In this case, the `request` object is expected to
     * have a `headers` property, which is an object containing the request
     * headers.
     * @returns The function `extractBearerToken` returns a string if a token is
     * found in the authorization header, or null if the authorization header is
     * missing or does not contain a token.
     */
    private extractBearerToken(request: any): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return null;
        }

        const [, token] = authHeader.split(" ");
        return token || null;
    }

    /**
     * The function `getUserData` takes a token as input and returns an Observable
     * that sends a request to the "auth.jwt.verify" endpoint with the token.
     * @param {string} token - A string representing the JWT token that needs to
     * be verified.
     * @returns an Observable of type number.
     */
    private getUserData(token: string): Observable<number> {
        return this.natsClient.send("auth.jwt.verify", token);
    }
}
