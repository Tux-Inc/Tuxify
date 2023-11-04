/*
File Name: oauth-provider-response.mapper.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mapper for oauth provider response

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
import { OAuthProvidersEnum } from "../../users/enums/oauth-providers.enum";
import { IOAuthProvider } from "../../users/interfaces/oauth-provider.interface";
import {
    IOAuthProviderResponse,
    IOAuthProvidersResponse,
} from "../interfaces/oauth-provider-response.interface";

/* The `OAuthProviderResponseMapper` class is responsible for mapping an
`IOAuthProvider` object to an `OAuthProviderResponseMapper` object with
additional properties. */
export class OAuthProviderResponseMapper implements IOAuthProviderResponse {
    @ApiProperty({
        description: "OAuth provider name",
        example: OAuthProvidersEnum.MICROSOFT,
        enum: OAuthProvidersEnum,
    })
    public readonly provider: OAuthProvidersEnum;

    @ApiProperty({
        description: "OAuth provider creation date",
        example: "2021-01-01T00:00:00.000Z",
        type: String,
    })
    public readonly createdAt: string;

    @ApiProperty({
        description: "OAuth provider last update date",
        example: "2021-01-01T00:00:00.000Z",
        type: String,
    })
    public readonly updatedAt: string;

    /**
     * The constructor function assigns the values from the IOAuthProviderResponse
     * object to the current object.
     * @param {IOAuthProviderResponse} values - The `values` parameter is an
     * object of type `IOAuthProviderResponse`. It is used to initialize the
     * properties of the current object instance. The `Object.assign()` method is
     * used to copy the properties from the `values` object to the current object
     * instance.
     */
    constructor(values: IOAuthProviderResponse) {
        Object.assign(this, values);
    }

    /**
     * The function "map" takes an IOAuthProvider object and returns an
     * OAuthProviderResponseMapper object with the provider, createdAt, and
     * updatedAt properties.
     * @param {IOAuthProvider} provider - The provider parameter is an object that
     * represents the OAuth provider. It likely contains information such as the
     * provider's name, client ID, client secret, and other relevant details.
     * @returns The code is returning an instance of the
     * `OAuthProviderResponseMapper` class.
     */
    public static map(provider: IOAuthProvider): OAuthProviderResponseMapper {
        return new OAuthProviderResponseMapper({
            provider: provider.provider,
            createdAt: provider.createdAt.toISOString(),
            updatedAt: provider.updatedAt.toISOString(),
        });
    }
}

/* The `OAuthProvidersResponseMapper` class is responsible for mapping OAuth
provider data into a standardized response format. */
export class OAuthProvidersResponseMapper implements IOAuthProvidersResponse {
    @ApiProperty({
        description: "OAuth providers",
        example: [
            {
                provider: OAuthProvidersEnum.MICROSOFT,
                createdAt: "2021-01-01T00:00:00.000Z",
                updatedAt: "2021-01-01T00:00:00.000Z",
            },
        ],
        type: [OAuthProviderResponseMapper],
    })
    public readonly data: OAuthProviderResponseMapper[];

    /**
     * The constructor function assigns the values from the
     * IOAuthProvidersResponse object to the current object.
     * @param {IOAuthProvidersResponse} values - The `values` parameter is an
     * object of type `IOAuthProvidersResponse`. It is used to initialize the
     * properties of the current object with the values from the `values` object.
     * The `Object.assign()` method is used to copy the values from `values` to
     * the current object.
     */
    constructor(values: IOAuthProvidersResponse) {
        Object.assign(this, values);
    }

    /**
     * The function takes an array of IOAuthProvider objects and returns an
     * instance of OAuthProvidersResponseMapper with the mapped data.
     * @param {IOAuthProvider[]} providers - An array of objects representing
     * different OAuth providers.
     * @returns The method is returning an instance of the
     * `OAuthProvidersResponseMapper` class.
     */
    public static map(
        providers: IOAuthProvider[],
    ): OAuthProvidersResponseMapper {
        return new OAuthProvidersResponseMapper({
            data: providers.map((provider) =>
                OAuthProviderResponseMapper.map(provider),
            ),
        });
    }
}
