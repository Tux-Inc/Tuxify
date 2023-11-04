/*
File Name: provider-request-tokens.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: ProviderRequestTokens DTO for ProviderRequestTokens DTO logic and routes definition
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

/* The `ProviderRequestTokens` class represents a request for tokens from a
provider, with the provider name and user ID as parameters. */
export class ProviderRequestTokens {
    /**
     * The constructor function takes in a provider string and a userId number and
     * assigns them to the corresponding properties of the class.
     * @param {string} provider - The provider parameter is a string that
     * represents the name or type of the provider. It could be a service
     * provider, an API provider, or any other type of provider that is relevant
     * to the context of the code.
     * @param {number} userId - The userId parameter is of type number and
     * represents the unique identifier of a user.
     */
    constructor(
        public readonly provider: string,
        public readonly userId: number,
    ) {}
}
