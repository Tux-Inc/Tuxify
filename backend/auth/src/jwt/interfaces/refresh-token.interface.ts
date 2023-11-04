/*
File Name: refresh-token.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Refresh token interface

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
import { IEmailPayload } from "./email-token.interface";

/* The `export interface IRefreshPayload extends IEmailPayload` is creating an
interface called `IRefreshPayload` that extends the `IEmailPayload` interface.
This means that the `IRefreshPayload` interface will inherit all the properties
and methods from the `IEmailPayload` interface. */
export interface IRefreshPayload extends IEmailPayload {
    tokenId: string;
}

/* The line `export interface IRefreshToken extends IRefreshPayload, ITokenBase
{}` is creating an interface called `IRefreshToken` that extends both the
`IRefreshPayload` and `ITokenBase` interfaces. This means that the
`IRefreshToken` interface will inherit all the properties and methods from both
the `IRefreshPayload` and `ITokenBase` interfaces. */
export interface IRefreshToken extends IRefreshPayload, ITokenBase {}
