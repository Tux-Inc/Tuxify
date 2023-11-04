/*
File Name: actions.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Actions controller for Actions controller logic and routes definition
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

import { ActionsService } from "./actions.service";
import { Controller, Inject } from "@nestjs/common";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { GmailPubsubPublishEvent } from "./events/gmail-pubsub-publish.event";

/* The ActionsController class is responsible for handling actions related to
receiving emails from a Gmail account and emitting available actions to a NATS
client. */
@Controller("actions")
export class ActionsController {
    /**
     * This constructor periodically emits a list of available actions to a NATS
     * client.
     * @param {ActionsService} actionsService - The `actionsService` parameter is
     * of type `ActionsService`. It is a service that provides various actions
     * that can be performed. It is likely used within the constructor to perform
     * actions or provide functionality related to actions.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator. It is used to
     * communicate with the NATS messaging system.
     */
    constructor(
        public readonly actionsService: ActionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const availableActions: ActionReaction[] = [
                {
                    name: "provider.google.action.gmail.receive",
                    type: "action",
                    title: "Receive an email",
                    description:
                        "Triggered when a new email is received on your Gmail account",
                    inputs: [],
                    outputs: [
                        {
                            name: "from",
                            title: "From",
                        },
                        {
                            name: "subject",
                            title: "Subject",
                        },
                        {
                            name: "body",
                            title: "Body",
                        },
                    ],
                },
            ];
            this.natsClient.emit<ActionReaction[]>(
                "heartbeat.providers.google.actions",
                availableActions,
            );
        }, 5000);
    }

    @MessagePattern("provider.google.action.gmail.receive")
    /**
     * The function "receiveEmail" is an asynchronous function that takes in a
     * payload of type GmailPubsubPublishEvent and returns a Promise that resolves
     * to void.
     * @param {GmailPubsubPublishEvent} data - The `data` parameter is of type
     * `GmailPubsubPublishEvent` and represents the payload of the email message
     * received. It contains information about the email, such as the sender,
     * recipient, subject, and body.
     * @returns a Promise that resolves to void.
     */
    async receiveEmail(
        @Payload() data: GmailPubsubPublishEvent,
    ): Promise<void> {
        return await this.actionsService.receiveEmail(data);
    }
}
