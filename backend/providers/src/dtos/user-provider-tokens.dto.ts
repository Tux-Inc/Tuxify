/*
File Name: user-provider-tokens.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: The `UserProviderTokens` class represents a user with access and refresh tokens, as well as a user ID.
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

/* The `UserProviderTokens` class represents a user's access token, refresh token,
and user ID. */
export class UserProviderTokens {
  /**
   * The constructor function takes in an access token, refresh token, and user ID
   * as parameters and assigns them to corresponding properties of the class.
   * @param {string} accessToken - A string representing the access token for the
   * user.
   * @param {string} refreshToken - The `refreshToken` parameter is a string that
   * represents a token used for refreshing the access token. It is typically used
   * in authentication systems to obtain a new access token when the current one
   * expires.
   * @param {number} userId - The `userId` parameter is of type `number` and
   * represents the unique identifier of a user.
   */
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly userId: number,
  ) {}
}
