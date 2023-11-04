/*
File Name: provider-user-infos.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Provider user infos dto for Provider user infos dto definition and configuration
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

/* The `ProviderUserInfos` class represents user information obtained from a
provider, such as email, name, access token, and refresh token. */
export class ProviderUserInfos {
    /**
     * The constructor function takes in several parameters and assigns them to
     * corresponding properties of the class.
     * @param {string} provider - The provider parameter is a string that
     * represents the authentication provider used for the user (e.g., Google,
     * Facebook, etc.).
     * @param {string} email - The email parameter is a string that represents the
     * email address of the user.
     * @param {string} name - The name parameter is a string that represents the
     * name of the user.
     * @param {string} accessToken - The access token is a string that is used to
     * authenticate and authorize requests made to an API. It is typically
     * obtained by the user during the authentication process and is used to
     * access protected resources on the API.
     * @param {string} refreshToken - The `refreshToken` parameter is a string
     * that represents a token used to obtain a new access token when the current
     * access token expires. It is typically used in authentication systems to
     * ensure that a user remains authenticated even after their access token
     * expires.
     */
    constructor(
        public readonly provider: string,
        public readonly email: string,
        public readonly name: string,
        public readonly accessToken: string,
        public readonly refreshToken: string,
    ) {}
}
