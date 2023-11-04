/*
File Name: gateway.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for gateway file
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

import { GatewayService } from "./gateway.service";
import { CreatedUserDto } from "./created-user.dto";
import { Body, Controller, Post } from "@nestjs/common";

/* The GatewayController class is a TypeScript controller that handles sending
emails using the GatewayService. */
@Controller()
export class GatewayController {
    /**
     * The constructor function takes a GatewayService instance as a parameter and
     * assigns it to the gatewayService property.
     * @param {GatewayService} gatewayService - The `gatewayService` parameter is
     * of type `GatewayService` and is marked as `private` and `readonly`. This
     * means that it can only be accessed within the class and its value cannot be
     * changed once it is assigned in the constructor.
     */
    constructor(private readonly gatewayService: GatewayService) {}

    @Post()
    /**
     * The function sends an email using the createdUserDto data.
     * @param {CreatedUserDto} createdUserDto - The `createdUserDto` parameter is
     * an object of type `CreatedUserDto`. It is passed as the body of the HTTP
     * request to the `sendEmail` method.
     */
    sendEmail(@Body() createdUserDto: CreatedUserDto) {
        this.gatewayService.sendEmail(createdUserDto);
    }
}
