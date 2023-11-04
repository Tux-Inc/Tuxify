/*
File Name: passwords.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for passwords

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
import { IsString, Length, Matches, MinLength } from "class-validator";
import { PASSWORD_REGEX } from "../../common/consts/regex.const";

/* The `PasswordsDto` class is a Data Transfer Object (DTO) used for validating
and transferring password-related data. It contains two properties: */
export abstract class PasswordsDto {
    @ApiProperty({
        description: "New password",
        minLength: 8,
        maxLength: 35,
        type: String,
    })
    @IsString()
    @Length(8, 35)
    @Matches(PASSWORD_REGEX, {
        message:
            "Password requires a lowercase letter, an uppercase letter, and a number or symbol",
    })
    public password1!: string;

    @ApiProperty({
        description: "Password confirmation",
        minLength: 1,
        type: String,
    })
    @IsString()
    @MinLength(1)
    public password2!: string;
}
