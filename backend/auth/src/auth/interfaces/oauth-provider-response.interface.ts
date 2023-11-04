/*
File Name: oauth-provider-response.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for oauth provider response

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

import { OAuthProvidersEnum } from "../../users/enums/oauth-providers.enum";

/* The `export interface IOAuthProviderResponse` is defining an interface in
TypeScript. */
export interface IOAuthProviderResponse {
    readonly provider: OAuthProvidersEnum;
    readonly createdAt: string;
    readonly updatedAt: string;
}

/* The `export interface IOAuthProvidersResponse` is defining an interface in
TypeScript. It specifies that an object of type `IOAuthProvidersResponse`
should have a property called `data` which is an array of objects of type
`IOAuthProviderResponse`. The `readonly` keyword indicates that the property
cannot be modified once it is assigned a value. */
export interface IOAuthProvidersResponse {
    readonly data: IOAuthProviderResponse[];
}
