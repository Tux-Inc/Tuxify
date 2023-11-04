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
import { SubscribeOutlookInput } from "./dtos/subscribe-outlook-input.dto";
import { SubscribeTodoInput } from "./dtos/subscribe-todo-input.dto";
import { CommonSubscribeInput } from "./dtos/common-subscribe-input.dto";
import {TodoNotification} from "./dtos/todo-notification.dto";

@Controller("actions")
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const availableActions: ActionReaction[] = [
                {
                    name: "provider.microsoft.action.outlook",
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
                {
                    name: "provider.microsoft.action.todo",
                    type: "action",
                    title: "New task",
                    description: "Trigger when a new task is created",
                    inputs: [
                        {
                            name: "taskListId",
                            title: "Task list ID",
                            placeholder: "Enter the task list ID",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "title",
                            title: "Title",
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

    @EventPattern("provider.microsoft.subscribe.outlook")
    async subscribeToOutlook(@Payload() csi: CommonSubscribeInput<SubscribeOutlookInput>): Promise<void> {
        return await this.actionsService.subscribeToOutlook(csi);
    }

    @EventPattern("provider.microsoft.subscribe.todo")
    async subscribeToTodo(@Payload() csi: CommonSubscribeInput<SubscribeTodoInput>): Promise<void> {
        return await this.actionsService.subscribeToTodo(csi);
    }

    @EventPattern("provider.microsoft.action.outlook")
    async receiveEmail(@Payload() data: OutlookMessageNotification): Promise<void> {
        await this.actionsService.receiveEmail(data);
    }

    @EventPattern("provider.microsoft.action.todo")
    async receiveTodoTask(@Payload() data: TodoNotification): Promise<void> {
        await this.actionsService.receiveTodo(data);
    }
}
