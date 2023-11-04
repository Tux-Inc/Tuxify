/*
File Name: credentials.embeddable.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Credentials embeddable

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

import dayjs from "dayjs";
import { Embeddable, Property } from "@mikro-orm/core";
import { ICredentials } from "../interfaces/credentials.interface";

/* The `CredentialsEmbeddable` class is an implementation of the `ICredentials`
interface with properties for version, last password, password update
timestamp, and general update timestamp, along with methods to update the
password and version. */
@Embeddable()
export class CredentialsEmbeddable implements ICredentials {
    @Property({ default: 0 })
    public version: number = 0;

    @Property({ default: "" })
    public lastPassword: string = "";

    @Property({ default: dayjs().unix() })
    public passwordUpdatedAt: number = dayjs().unix();

    @Property({ default: dayjs().unix() })
    public updatedAt: number = dayjs().unix();

    /**
     * The constructor function initializes the version property based on the
     * value of the isConfirmed parameter.
     * @param [isConfirmed=false] - The isConfirmed parameter is a boolean value
     * that determines whether the version should be set to 1 or 0. If isConfirmed
     * is true, the version will be set to 1. If isConfirmed is false (or not
     * provided), the version will be set to 0.
     */
    constructor(isConfirmed = false) {
        this.version = isConfirmed ? 1 : 0;
    }

    /**
     * The function updates the password and related properties of an object.
     * @param {string} password - The `password` parameter is a string that
     * represents the new password that needs to be updated.
     */
    public updatePassword(password: string): void {
        this.version++;
        this.lastPassword = password;
        const now = dayjs().unix();
        this.passwordUpdatedAt = now;
        this.updatedAt = now;
    }

    /**
     * The function "updateVersion" increments the version number and updates the
     * "updatedAt" property with the current timestamp.
     */
    public updateVersion(): void {
        this.version++;
        this.updatedAt = dayjs().unix();
    }
}
