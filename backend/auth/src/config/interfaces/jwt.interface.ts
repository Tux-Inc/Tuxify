/*
File Name: jwt.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: JWT interface

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

/* The `ISingleJwt` interface is defining the structure of a JSON Web Token (JWT)
for a single purpose. It has two properties: */
export interface ISingleJwt {
    secret: string;
    time: number;
}

/* The `IAccessJwt` interface is defining the structure of a JSON Web Token (JWT)
for access purposes. It has three properties: `publicKey`, `privateKey`, and
`time`. */
export interface IAccessJwt {
    publicKey: string;
    privateKey: string;
    time: number;
}

/* The `export interface IJwt` is defining an interface named `IJwt` that
describes the structure of a JSON Web Token (JWT) object. It has four
properties: `access`, `confirmation`, `resetPassword`, and `refresh`. */
export interface IJwt {
    access: IAccessJwt;
    confirmation: ISingleJwt;
    resetPassword: ISingleJwt;
    refresh: ISingleJwt;
}
