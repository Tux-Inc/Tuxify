/*
File Name: user.entity.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Entity for user

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
    Collection,
    Embedded,
    Entity,
    OneToMany,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import {
    BCRYPT_HASH_OR_UNSET,
    NAME_REGEX,
    SLUG_REGEX,
} from "../../common/consts/regex.const";
import { IUser } from "../interfaces/user.interface";
import { OAuthProviderEntity } from "./oauth-provider.entity";
import { CredentialsEmbeddable } from "../embeddables/credentials.embeddable";
import { IsBoolean, IsEmail, IsString, Length, Matches } from "class-validator";

/* The UserEntity class represents a user entity with various properties and
relationships. */
@Entity({ tableName: "users" })
export class UserEntity implements IUser {
    @PrimaryKey()
    public id: number;

    @Property({ columnType: "varchar", length: 100 })
    @IsString()
    @Length(3, 100)
    @Matches(NAME_REGEX, {
        message: "Name must not have special characters",
    })
    public name: string;

    @Property({ columnType: "varchar", length: 106 })
    @IsString()
    @Length(3, 106)
    @Matches(SLUG_REGEX, {
        message: "Username must be a valid slugs",
    })
    public username: string;

    @Property({ columnType: "varchar", length: 255 })
    @IsString()
    @IsEmail()
    @Length(5, 255)
    public email: string;

    @Property({ columnType: "varchar", length: 60 })
    @IsString()
    @Length(5, 60)
    @Matches(BCRYPT_HASH_OR_UNSET)
    public password: string;

    @Property({ columnType: "boolean", default: false })
    @IsBoolean()
    public confirmed: true | false = false;

    @Embedded(() => CredentialsEmbeddable)
    public credentials: CredentialsEmbeddable = new CredentialsEmbeddable();

    @Property({ onCreate: () => new Date() })
    public createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    public updatedAt: Date = new Date();

    @OneToMany(() => OAuthProviderEntity, (oauth) => oauth.user)
    public oauthProviders = new Collection<OAuthProviderEntity, UserEntity>(
        this,
    );
}
