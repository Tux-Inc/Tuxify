/*
 * File Name: actions.controller.ts
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

import { Controller, Inject } from "@nestjs/common";
import { ActionsService } from "./actions.service";
import { ClientProxy, EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { OutlookMessageNotification } from "./dtos/outlook-message-notification.dto";
import { AddedProvider } from "./dtos/added-provider.dto";

@Controller("actions")
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const availableActions: ActionReaction[] = [
                {
                    name: "provider.microsoft.action.outlook.message",
                    type: "action",
                    title: "New email",
                    description: "Trigger when a new email arrives",
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
            this.natsClient.emit<ActionReaction>("heartbeat.providers.microsoft.actions", availableActions);
        }, 5000);
    }

    @EventPattern("provider.microsoft.add.callback.success")
    async subscribeToActions(@Payload() addedProvider: AddedProvider): Promise<void> {
        return await this.actionsService.subscribeToReceiveEmail(addedProvider.userId);
    }

    @EventPattern("provider.microsoft.action.outlook.message")
    async receiveEmail(@Payload() data: OutlookMessageNotification): Promise<void> {
        await this.actionsService.receiveEmail(data);
    }
}
