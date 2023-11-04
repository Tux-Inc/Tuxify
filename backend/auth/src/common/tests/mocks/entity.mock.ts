/*
File Name: entity.mock.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mock for entity

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

import { IsString, IsUUID, Length, Matches } from "class-validator";
import { v4 } from "uuid";
import { NAME_REGEX } from "../../consts/regex.const";

/* The EntityMock class represents an entity with an id and a name, with
validation rules for the name property. */
export class EntityMock {
    @IsString()
    @IsUUID(4)
    public id: string;

    @IsString()
    @Length(3, 100)
    @Matches(NAME_REGEX, {
        message: "name must not have special characters",
    })
    public name: string;

    /**
     * The constructor function initializes an object with a unique id and a given
     * name.
     * @param {string} name - The "name" parameter is a string that represents the
     * name of an object or entity.
     */
    constructor(name: string) {
        this.id = v4();
        this.name = name;
    }
}
