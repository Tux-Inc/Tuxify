/*
File Name: access-token.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Access token interface

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

import { ITokenBase } from "./token-base.interface";

/* The `export interface IAccessPayload` is defining an interface called
`IAccessPayload`. This interface has a single property `id` of type `number`.
By exporting this interface, it can be used in other files and modules. */
export interface IAccessPayload {
    id: number;
}

/* The line `export interface IAccessToken extends IAccessPayload, ITokenBase {}`
is defining an interface called `IAccessToken` that extends both the
`IAccessPayload` and `ITokenBase` interfaces. This means that the
`IAccessToken` interface will inherit all the properties and methods from both
`IAccessPayload` and `ITokenBase`. */
export interface IAccessToken extends IAccessPayload, ITokenBase {}
