/*
File Name: auth-response.mapper.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mapper for auth response

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

import { ApiProperty } from "@nestjs/swagger";
import { IAuthResponse } from "../interfaces/auth-response.interface";
import { IAuthResult } from "../interfaces/auth-result.interface";
import { AuthResponseUserMapper } from "./auth-response-user.mapper";

/* The AuthResponseMapper class is responsible for mapping the authentication
response data to a standardized format. */
export class AuthResponseMapper implements IAuthResponse {
    @ApiProperty({
        description: "User",
        type: AuthResponseUserMapper,
    })
    public readonly user: AuthResponseUserMapper;

    @ApiProperty({
        description: "Access token",
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        type: String,
    })
    public readonly accessToken: string;

    @ApiProperty({
        description: "Refresh token",
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        type: String,
    })
    public readonly refreshToken: string;

    /**
     * The constructor function assigns the values from the IAuthResponse
     * interface to the current object.
     * @param {IAuthResponse} values - The `values` parameter is an object of type
     * `IAuthResponse`. It is used to initialize the properties of the current
     * object instance. The `Object.assign()` method is used to copy the values
     * from the `values` object to the current object instance.
     */
    constructor(values: IAuthResponse) {
        Object.assign(this, values);
    }

    /**
     * The function "map" takes an IAuthResult object and returns an
     * AuthResponseMapper object with mapped properties.
     * @param {IAuthResult} result - The `result` parameter is an object of type
     * `IAuthResult`.
     * @returns The code is returning an instance of the AuthResponseMapper class.
     */
    public static map(result: IAuthResult): AuthResponseMapper {
        return new AuthResponseMapper({
            user: AuthResponseUserMapper.map(result.user),
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }
}
