/*
File Name: gmail.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: GmailController for GmailController logic and routes definitio
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

import { Controller } from "@nestjs/common";
import { GmailService } from "./gmail.service";
import { EventPattern } from "@nestjs/microservices";
import { AddedProvider } from "../auth/dtos/added-provider.dto";

/* The GmailController class is a TypeScript controller that handles events
related to adding a user to a publisher in the Gmail service. */
@Controller("gmail")
export class GmailController {
    /**
     * The constructor function takes a GmailService object as a parameter and
     * assigns it to the gmailService property.
     * @param {GmailService} gmailService - The `gmailService` parameter is of
     * type `GmailService` and is marked as `public` and `readonly`. This means
     * that it is a required parameter for the constructor and cannot be modified
     * after the object is created. The `GmailService` is likely a service or
     * class that provides
     */
    constructor(public readonly gmailService: GmailService) {}

    @EventPattern("provider.google.add.callback.success")
    /**
     * The function `addUserToPublisher` adds a user to a publisher using the
     * `gmailService` service.
     * @param {AddedProvider} addedProvider - The addedProvider parameter is an
     * object that contains information about the provider being added. It likely
     * includes properties such as the provider's name, email address, and any
     * other relevant details.
     * @returns a Promise that resolves to void.
     */
    async addUserToPublisher(addedProvider: AddedProvider): Promise<void> {
        return await this.gmailService.addUserToPublisher(addedProvider);
    }
}
