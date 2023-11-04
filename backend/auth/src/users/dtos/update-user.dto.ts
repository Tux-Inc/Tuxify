/*
File Name: update-user.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for updating user

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
import { IsString, Length, Matches, ValidateIf } from "class-validator";
import { NAME_REGEX, SLUG_REGEX } from "../../common/consts/regex.const";
import { isNull, isUndefined } from "../../common/utils/validation.util";

/* The `UpdateUserDto` class is a Data Transfer Object (DTO) used for updating
user information. It contains two properties: `username` and `name`. */
export abstract class UpdateUserDto {
    @ApiProperty({
        description: "The new username",
        example: "new-username",
        type: String,
    })
    @IsString()
    @Length(3, 106)
    @Matches(SLUG_REGEX, {
        message: "Username must be a valid slugs",
    })
    @ValidateIf(
        (o: UpdateUserDto) =>
            !isUndefined(o.username) || isUndefined(o.name) || isNull(o.name),
    )
    public username?: string;

    @ApiProperty({
        description: "The new name",
        example: "John Doe",
        type: String,
    })
    @IsString()
    @Length(3, 100)
    @Matches(NAME_REGEX, {
        message: "Name must not have special characters",
    })
    @ValidateIf(
        (o: UpdateUserDto) =>
            !isUndefined(o.name) ||
            isUndefined(o.username) ||
            isNull(o.username),
    )
    public name?: string;
}
