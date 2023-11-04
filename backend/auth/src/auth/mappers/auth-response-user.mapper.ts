/*
File Name: auth-response-user.mapper.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mapper for auth response user

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
import { IUser } from "../../users/interfaces/user.interface";
import { IAuthResponseUser } from "../interfaces/auth-response-user.interface";

/* The AuthResponseUserMapper class is used to map user data from IUser to
IAuthResponseUser with additional validation properties. */
export class AuthResponseUserMapper implements IAuthResponseUser {
    @ApiProperty({
        description: "User id",
        example: 123,
        minimum: 1,
        type: Number,
    })
    public id: number;

    @ApiProperty({
        description: "User name",
        example: "John Doe",
        minLength: 3,
        maxLength: 100,
        type: String,
    })
    public name: string;

    @ApiProperty({
        description: "User username",
        example: "john.doe1",
        minLength: 3,
        maxLength: 106,
        type: String,
    })
    public username: string;

    @ApiProperty({
        description: "User email",
        example: "example@gmail.com",
        minLength: 5,
        maxLength: 255,
    })
    public email: string;

    @ApiProperty({
        description: "User creation date",
        example: "2021-01-01T00:00:00.000Z",
        type: String,
    })
    public createdAt: string;

    @ApiProperty({
        description: "User last update date",
        example: "2021-01-01T00:00:00.000Z",
        type: String,
    })
    public updatedAt: string;

    /**
     * The constructor function assigns the values from the IAuthResponseUser
     * interface to the current object.
     * @param {IAuthResponseUser} values - The `values` parameter is an object of
     * type `IAuthResponseUser`. It is used to initialize the properties of the
     * current object instance. The `Object.assign()` method is used to copy the
     * values from the `values` object to the current object instance.
     */
    constructor(values: IAuthResponseUser) {
        Object.assign(this, values);
    }

    /**
     * The function maps properties from an IUser object to an
     * AuthResponseUserMapper object.
     * @param {IUser} user - The "user" parameter is an object of type "IUser"
     * which represents a user in the system. It contains properties such as "id",
     * "name", "username", "email", "createdAt", and "updatedAt".
     * @returns The code is returning an instance of the AuthResponseUserMapper
     * class.
     */
    public static map(user: IUser): AuthResponseUserMapper {
        return new AuthResponseUserMapper({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
    }
}
