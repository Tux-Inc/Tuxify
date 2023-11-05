/*
File Name: oauth-provider.entity.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Entity for oauth provider

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

import {
    Entity,
    Enum,
    ManyToOne,
    PrimaryKeyType,
    Property,
    Unique,
} from "@mikro-orm/core";
import { IsEnum } from "class-validator";
import { UserEntity } from "./user.entity";
import { OAuthProvidersEnum } from "../enums/oauth-providers.enum";
import { IOAuthProvider } from "../interfaces/oauth-provider.interface";

/* The class OAuthProviderEntity represents an entity for storing OAuth provider
information associated with a user. */
@Entity({ tableName: "oauth_providers" })
@Unique({ properties: ["provider", "user"] })
export class OAuthProviderEntity implements IOAuthProvider {
    @Enum({
        items: () => OAuthProvidersEnum,
        primary: true,
        columnType: "varchar",
        length: 9,
    })
    @IsEnum(OAuthProvidersEnum)
    public provider: OAuthProvidersEnum;

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: (u) => u.oauthProviders,
        primary: true,
        onDelete: "cascade",
    })
    public user: UserEntity;

    @Property({ onCreate: () => new Date() })
    public createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    public updatedAt: Date = new Date();

    [PrimaryKeyType]?: [OAuthProvidersEnum, number];
}
