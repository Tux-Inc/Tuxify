/*
 * File Name: microsoft.controller.ts
 * Author: neptos
 * Creation Date: 2023
 *
 * Copyright (c) 2023 Tux Inc. (backend)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { MicrosoftService } from "./microsoft.service";
import { ActionReaction } from "./dtos/action-reaction.dto";
import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { ActionReactionService } from "./dtos/action-reaction-service.dto";

/* The MicrosoftController class is a TypeScript controller that handles actions
and reactions for the Microsoft service. */
@Controller()
export class MicrosoftController {
    private readonly logger: Logger = new Logger(MicrosoftController.name);
    private availableActions: ActionReaction[] = [];
    private availableReactions: ActionReaction[] = [];

    /**
     * The constructor function periodically emits a heartbeat message containing
     * information about the Microsoft service to a NATS client.
     * @param {MicrosoftService} microsoftService - The `microsoftService`
     * parameter is of type `MicrosoftService`. It is a dependency that is
     * injected into the constructor. It is used to interact with the Microsoft
     * service and perform various operations.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is an instance
     * of the `ClientProxy` class, which is used to communicate with a NATS
     * server. It is injected into the constructor using the `@Inject` decorator.
     */
    constructor(
        private readonly microsoftService: MicrosoftService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const providerInfos: ActionReactionService = {
                name: "microsoft",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png",
                title: "Microsoft",
                description:
                    "Microsoft is a service that provides a lot of services like Office 365, Azure, etc.",
                actions: this.availableActions,
                reactions: this.availableReactions,
            };
            this.natsClient.emit<ActionReactionService>(
                "heartbeat.providers.microsoft",
                providerInfos,
            );
        }, 5000);
    }

    @EventPattern("heartbeat.providers.microsoft.actions")
    /**
     * The function sets the available actions information based on the provided
     * payload data.
     * @param {ActionReaction[]} data - An array of objects of type
     * ActionReaction.
     */
    setActionsInfos(@Payload() data: ActionReaction[]): void {
        this.availableActions = data;
    }

    @EventPattern("heartbeat.providers.microsoft.reactions")
    /**
     * The function sets the available reactions based on the provided data.
     * @param {ActionReaction[]} data - An array of objects of type
     * ActionReaction.
     */
    setReactionsInfos(@Payload() data: ActionReaction[]): void {
        this.availableReactions = data;
    }
}
