/*
File Name: message.mapper.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mapper for message

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
import { v4 } from "uuid";
import { IMessage } from "../interfaces/message.interface";

/* The MessageMapper class is a TypeScript class that represents a message with an
ID and a message content. */
export class MessageMapper implements IMessage {
    @ApiProperty({
        description: "Message UUID",
        example: "c0a80121-7ac0-11d1-898c-00c04fd8d5cd",
        type: String,
    })
    public id: string;

    @ApiProperty({
        description: "Message",
        example: "Hello World",
        type: String,
    })
    public message: string;

    /**
     * The constructor function initializes an object with a unique id and a
     * message.
     * @param {string} message - The `message` parameter is a string that
     * represents the message that will be assigned to the `message` property of
     * the object being constructed.
     */
    constructor(message: string) {
        this.id = v4();
        this.message = message;
    }
}
