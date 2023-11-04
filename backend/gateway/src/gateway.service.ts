/*
File Name: gateway.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Service for gateway file
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

import { ClientProxy } from "@nestjs/microservices";
import { CreatedUserDto } from "./created-user.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";

/* The GatewayService class is an Injectable service that uses a NATS client to
emit a "user.created" event with a CreatedUserDto payload. */
@Injectable()
export class GatewayService {
    private readonly logger: Logger = new Logger(GatewayService.name);

    /**
     * The constructor function takes in a client proxy object and injects it as a
     * dependency using the "NATS_CLIENT" token.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is being injected using the `@Inject` decorator. It is
     * likely being used to establish a connection to a NATS server for messaging
     * purposes.
     */
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {}

    /**
     * The sendEmail function emits a "user.created" event with the createdUserDto
     * data.
     * @param {CreatedUserDto} createdUserDto - The `createdUserDto` parameter is
     * an object of type `CreatedUserDto`. It likely contains information about a
     * user that was created, such as their name, email, and any other relevant
     * details.
     */
    sendEmail(createdUserDto: CreatedUserDto) {
        this.natsClient.emit("user.created", createdUserDto);
    }
}
