/*
File Name: sign-up.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for signing up a user

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
import { IsEmail, IsString, Length, Matches } from "class-validator";
import { NAME_REGEX } from "../../common/consts/regex.const";
import { PasswordsDto } from "./passwords.dto";

/* The code is defining a TypeScript class called `SignUpDto` that extends another
class called `PasswordsDto`. */
export abstract class SignUpDto extends PasswordsDto {
    @ApiProperty({
        description: "The user name",
        minLength: 3,
        maxLength: 100,
        type: String,
    })
    @IsString()
    @Length(3, 100, {
        message: "Name has to be between 3 and 100 characters.",
    })
    @Matches(NAME_REGEX, {
        message: "Name can only contain letters, dtos, numbers and spaces.",
    })
    public name!: string;

    @ApiProperty({
        description: "The user email",
        example: "example@gmail.com",
        minLength: 5,
        maxLength: 255,
        type: String,
    })
    @IsString()
    @IsEmail()
    @Length(5, 255)
    public email!: string;
}
