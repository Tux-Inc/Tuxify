/*
File Name: response-user.mapper.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mapper for response user

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
import { IUser } from "../interfaces/user.interface";
import { IResponseUser } from "../interfaces/response-user.interface";

/* The `ResponseUserMapper` class is used to map user data from the `IUser`
interface to a response object with specific properties and formatting. */
export class ResponseUserMapper implements IResponseUser {
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
        description: "User email",
        example: "john.doe@example.com",
        minLength: 3,
        maxLength: 100,
        type: String,
    })
    public email: string;

    @ApiProperty({
        description: "User username",
        example: "john.doe1",
        minLength: 3,
        maxLength: 106,
        type: String,
    })
    public username: string;

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

    constructor(values: IResponseUser) {
        Object.assign(this, values);
    }

    /**
     * The function maps properties from an IUser object to a ResponseUserMapper
     * object.
     * @param {IUser} user - The `user` parameter is an object of type `IUser`. It
     * represents a user entity and contains properties such as `id`, `name`,
     * `email`, `username`, `createdAt`, and `updatedAt`.
     * @returns The code is returning a new instance of the ResponseUserMapper
     * class, with the properties id, name, email, username, createdAt, and
     * updatedAt set based on the properties of the user object passed as an
     * argument.
     */
    public static map(user: IUser): ResponseUserMapper {
        return new ResponseUserMapper({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
    }
}
