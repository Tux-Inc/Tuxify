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

import { ActionsService } from "./actions.service";
import {
    ClientProxy,
    EventPattern,
    MessagePattern,
    Payload,
} from "@nestjs/microservices";
import { Controller, Inject } from "@nestjs/common";
import { AddedProvider } from "./dtos/added-provider.dto";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { TodoNotification } from "./dtos/todo-notification.dto";
import { SubscribeTodoInput } from "./dtos/subscribe-todo-input.dto";
import { CommonSubscribeInput } from "./dtos/common-subscribe-input.dto";
import { SubscribeOutlookInput } from "./dtos/subscribe-outlook-input.dto";
import { OutlookMessageNotification } from "./dtos/outlook-message-notification.dto";

/* The ActionsController class is responsible for handling actions and
subscriptions related to Microsoft services such as Outlook and Todo. */
@Controller("actions")
export class ActionsController {
    /**
     * The constructor function periodically emits available actions to a NATS
     * client.
     * @param {ActionsService} actionsService - The `actionsService` parameter is
     * of type `ActionsService`. It is a service that provides methods for
     * performing actions related to the application's functionality.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator. It is used to
     * emit a heartbeat event to the NATS server with the available actions.
     */
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
            this.natsClient.emit<ActionReaction>(
                "heartbeat.providers.microsoft.actions",
                availableActions,
            );
        }, 5000);
    }

    @EventPattern("provider.microsoft.subscribe.outlook")
    /**
     * The function `subscribeToOutlook` is an asynchronous function that takes a
     * payload and subscribes to Outlook using the provided input.
     * @param csi - The `csi` parameter is of type
     * `CommonSubscribeInput<SubscribeOutlookInput>`. It is an input object that
     * contains the necessary information for subscribing to Outlook. The
     * `CommonSubscribeInput` is a generic type that takes `SubscribeOutlookInput`
     * as its type argument.
     * @returns a Promise that resolves to void.
     */
    async subscribeToOutlook(
        @Payload() csi: CommonSubscribeInput<SubscribeOutlookInput>,
    ): Promise<void> {
        return await this.actionsService.subscribeToOutlook(csi);
    }

    @EventPattern("provider.microsoft.subscribe.todo")
    /**
     * The function "subscribeToTodo" is an asynchronous function that takes a
     * payload and subscribes to a todo item.
     * @param csi - The `csi` parameter is of type
     * `CommonSubscribeInput<SubscribeTodoInput>`. It is an input object that
     * contains the necessary information for subscribing to a todo.
     * @returns a Promise that resolves to void.
     */
    async subscribeToTodo(
        @Payload() csi: CommonSubscribeInput<SubscribeTodoInput>,
    ): Promise<void> {
        return await this.actionsService.subscribeToTodo(csi);
    }

    @EventPattern("provider.microsoft.action.outlook")
    /**
     * The `receiveEmail` function is an asynchronous function that receives an
     * Outlook message notification and passes it to the `receiveEmail` method of
     * the `actionsService` object.
     * @param {OutlookMessageNotification} data - The `data` parameter is of type
     * `OutlookMessageNotification` and represents the payload of the email
     * notification received.
     */
    async receiveEmail(
        @Payload() data: OutlookMessageNotification,
    ): Promise<void> {
        await this.actionsService.receiveEmail(data);
    }

    @EventPattern("provider.microsoft.action.todo")
    /**
     * The function "receiveTodoTask" receives a payload of data and calls the
     * "receiveTodo" function from the "actionsService" asynchronously.
     * @param {TodoNotification} data - The `data` parameter is of type
     * `TodoNotification` and is decorated with `@Payload()`. This means that it
     * is expected to receive the payload data from the incoming message. The
     * `TodoNotification` type represents the structure of the data being
     * received.
     */
    async receiveTodoTask(@Payload() data: TodoNotification): Promise<void> {
        await this.actionsService.receiveTodo(data);
    }
}
