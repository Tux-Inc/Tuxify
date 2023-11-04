/*
File Name: user.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for user

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

import { ICredentials } from "./credentials.interface";

/* The `export interface IUser` is defining an interface in TypeScript called
`IUser`. An interface is a way to define the structure of an object. In this
case, the `IUser` interface has several properties such as `id`, `name`,
`username`, `email`, `password`, `confirmed`, `credentials`, `createdAt`, and
`updatedAt`. Each property has a specific type, such as `number`, `string`,
`boolean`, `ICredentials`, or `Date`. This interface can be used to define
objects that adhere to this structure, ensuring that they have all the required
properties and their types match the specified types. The `export` keyword
makes this interface accessible to other files that import it. */
export interface IUser {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    confirmed: boolean;
    credentials: ICredentials;
    createdAt: Date;
    updatedAt: Date;
}
