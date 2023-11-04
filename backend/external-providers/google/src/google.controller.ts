/*
File Name: google.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: GoogleController for GoogleController logic and routes definition
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

import { GoogleService } from "./google.service";
import { ActionReaction } from "./dtos/action-reaction.dto";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { ActionReactionService } from "./dtos/action-reaction-service.dto";

/* The GoogleController class is a TypeScript controller that handles actions and
reactions for the Google service. */
@Controller()
export class GoogleController {
    public readonly logger: Logger = new Logger(GoogleController.name);
    public availableActions: ActionReaction[] = [];
    public availableReactions: ActionReaction[] = [];

    /**
     * The constructor function periodically emits a heartbeat message containing
     * information about the Google service to a NATS client.
     * @param {GoogleService} googleService - The `googleService` parameter is an
     * instance of the `GoogleService` class. It is being injected into the
     * constructor and is marked as `private readonly`, which means it is a
     * private property and cannot be modified outside of the constructor.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator. It is used to
     * emit a heartbeat event to a NATS server every 5 seconds. The emitted event
     * contains information about the Google service, such as its name, image,
     */
    constructor(
        private readonly googleService: GoogleService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const providerInfos: ActionReactionService = {
                name: "google",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                title: "Google",
                description:
                    "Google service including Gmail, Sheets, Docs and many more...",
                actions: this.availableActions,
                reactions: this.availableReactions,
            };
            this.natsClient.emit<ActionReactionService>(
                "heartbeat.providers.google",
                providerInfos,
            );
        }, 5000);
    }

    @EventPattern("heartbeat.providers.google.actions")
    /**
     * The function sets the available actions information based on the provided
     * payload data.
     * @param {ActionReaction[]} data - An array of objects of type
     * ActionReaction.
     */
    setActionsInfos(@Payload() data: ActionReaction[]): void {
        this.availableActions = data;
    }

    @EventPattern("heartbeat.providers.google.reactions")
    /**
     * The function sets the available reactions based on the provided data.
     * @param {ActionReaction[]} data - An array of objects of type
     * ActionReaction.
     */
    setReactionsInfos(@Payload() data: ActionReaction[]): void {
        this.availableReactions = data;
    }
}
