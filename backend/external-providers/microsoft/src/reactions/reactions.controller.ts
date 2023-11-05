/*
 * File Name: reactions.controller.ts
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

import { Observable } from "rxjs";
import { Controller, Inject } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { TasksListInput } from "../dtos/tasks-list-input.dto";
import { TasksTodoInput } from "../dtos/tasks-todo-input.dto";
import { TasksTodoOutput } from "../dtos/tasks-todo-output.dto";
import { TasksListOutput } from "../dtos/tasks-list-output.dto";
import { OneNotePageInput } from "../dtos/onenote-page-input.dto";
import { OneNotePageOutput } from "../dtos/onenote-page-output.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { TasksTodoDeleteInput } from "../dtos/tasks-todo-delete-input.dto";
import { TasksListDeleteInput } from "../dtos/tasks-list-delete-input.dto";
import { OutlookSendEmailInput } from "../dtos/outlook-send-email-input.dto";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";

/* The ReactionsController class is a TypeScript controller that handles various
reactions related to Microsoft services such as OneNote, Outlook, and Microsoft
To Do. */
@Controller("reactions")
export class ReactionsController {
    /**
     * The constructor function periodically emits a list of available reactions
     * to a NATS client.
     * @param {ReactionsService} reactionsService - The `reactionsService`
     * parameter is an instance of the `ReactionsService` class. It is used to
     * perform actions related to reactions, such as creating, deleting, or
     * retrieving reactions.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator. It is used to
     * emit a heartbeat event to the NATS server every 5 seconds. The emitted
     * event contains an array of `ActionReaction` objects representing the
     * available reactions for
     */
    constructor(
        public readonly reactionsService: ReactionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const availableReactions: ActionReaction[] = [
                {
                    name: "provider.microsoft.reaction.onenote.create",
                    type: "reaction",
                    title: "Create a OneNote page",
                    description: "Create a new OneNote page",
                    inputs: [
                        {
                            name: "title",
                            title: "Title",
                            placeholder: "title",
                            required: true,
                        },
                        {
                            name: "content",
                            title: "Content",
                            placeholder: "content",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "pageId",
                            title: "Page ID",
                        },
                    ],
                },
                {
                    name: "provider.microsoft.reaction.outlook.send",
                    type: "reaction",
                    title: "Send an email",
                    description: "Send an email to a recipient",
                    inputs: [
                        {
                            name: "from",
                            title: "From",
                            placeholder: "john.doe@example.com",
                            required: true,
                        },
                        {
                            name: "to",
                            title: "To",
                            placeholder: "john.doe@example.com",
                            required: true,
                        },
                        {
                            name: "subject",
                            title: "Subject",
                            placeholder: "Example subject",
                            required: true,
                        },
                        {
                            name: "body",
                            title: "Body",
                            placeholder: "Example email body...",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
                {
                    name: "provider.microsoft.reaction.tasks.list.create",
                    type: "reaction",
                    title: "Create a new list",
                    description: "Create a new list in Microsoft To Do",
                    inputs: [
                        {
                            name: "displayName",
                            title: "Display Name",
                            placeholder: "display name",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "listId",
                            title: "List ID",
                        },
                    ],
                },
                {
                    name: "provider.microsoft.reaction.tasks.list.delete",
                    type: "reaction",
                    title: "Delete a list",
                    description: "Delete a list in Microsoft To Do",
                    inputs: [
                        {
                            name: "listId",
                            title: "List ID",
                            placeholder: "list id",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
                {
                    name: "provider.microsoft.reaction.tasks.todo.create",
                    type: "reaction",
                    title: "Create a new task",
                    description: "Create a new task in Microsoft To Do",
                    inputs: [
                        {
                            name: "listId",
                            title: "List ID",
                            placeholder: "list id",
                            required: true,
                        },
                        {
                            name: "title",
                            title: "Title",
                            placeholder: "title",
                            required: true,
                        },
                        {
                            name: "content",
                            title: "Content",
                            placeholder: "content",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "taskId",
                            title: "Task ID",
                        },
                    ],
                },
                {
                    name: "provider.microsoft.reaction.tasks.todo.delete",
                    type: "reaction",
                    title: "Delete a task",
                    description: "Delete a task in Microsoft To Do",
                    inputs: [
                        {
                            name: "listId",
                            title: "List ID",
                            placeholder: "list id",
                            required: true,
                        },
                        {
                            name: "taskId",
                            title: "Task ID",
                            placeholder: "task id",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
            ];
            this.natsClient.emit<ActionReaction[]>(
                "heartbeat.providers.microsoft.reactions",
                availableReactions,
            );
        }, 5000);
    }

    @MessagePattern("provider.microsoft.reaction.onenote.create")
    /**
     * The function `createOneNotePage` takes a `commonReactionInput` and returns
     * an observable of type `OneNotePageOutput`.
     * @param commonReactionInput - A generic input object that contains the
     * necessary data for creating a OneNote page. It is of type
     * CommonReactionInput<OneNotePageInput>.
     * @returns an Observable of type OneNotePageOutput.
     */
    createOneNotePage(
        @Payload() commonReactionInput: CommonReactionInput<OneNotePageInput>,
    ): Observable<OneNotePageOutput> {
        return this.reactionsService.createOneNotePage(commonReactionInput);
    }

    @MessagePattern("provider.microsoft.reaction.outlook.send")
    /**
     * The function sends an email using the Outlook API.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<OutlookSendEmailInput>`. It is an input object that
     * contains the necessary information to send an email using Outlook. The
     * `OutlookSendEmailInput` is a specific type of input object that contains
     * the details of the
     * @returns an Observable<any>.
     */
    sendEmail(
        @Payload()
        commonReactionInput: CommonReactionInput<OutlookSendEmailInput>,
    ): Observable<any> {
        return this.reactionsService.sendEmail(commonReactionInput);
    }

    @MessagePattern("provider.microsoft.reaction.tasks.list.create")
    /**
     * The function creates a task list using the input provided and returns an
     * observable of the output.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<TasksListInput>`. It is an input object that contains
     * the necessary data to create a task list. The `TasksListInput` is a generic
     * type that represents the specific input data for creating a task list.
     * @returns an Observable of type TasksListOutput.
     */
    createList(
        @Payload() commonReactionInput: CommonReactionInput<TasksListInput>,
    ): Observable<TasksListOutput> {
        return this.reactionsService.createTaskList(commonReactionInput);
    }

    @MessagePattern("provider.microsoft.reaction.tasks.list.delete")
    /**
     * The function `deleteList` takes a `commonReactionInput` as a parameter and
     * calls the `deleteTaskList` method of the `reactionsService` to delete a
     * task list.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<TasksListDeleteInput>`. It is an input object that
     * contains the necessary information to delete a task list. The
     * `TasksListDeleteInput` is a specific type that represents the input for
     * deleting a task list.
     * @returns The deleteList function is returning an Observable.
     */
    deleteList(
        @Payload()
        commonReactionInput: CommonReactionInput<TasksListDeleteInput>,
    ): Observable<any> {
        return this.reactionsService.deleteTaskList(commonReactionInput);
    }

    @MessagePattern("provider.microsoft.reaction.tasks.todo.create")
    /**
     * The function creates a task using the common reaction input and returns an
     * observable of the tasks todo output.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<TasksTodoInput>`. It is an input object that contains
     * the necessary data to create a task.
     * @returns The createTask function is returning an Observable of type
     * TasksTodoOutput.
     */
    createTask(
        @Payload() commonReactionInput: CommonReactionInput<TasksTodoInput>,
    ): Observable<TasksTodoOutput> {
        return this.reactionsService.createTask(commonReactionInput);
    }

    @MessagePattern("provider.microsoft.reaction.tasks.todo.delete")
    /**
     * The function `deleteTask` takes a `commonReactionInput` as a parameter and
     * returns an Observable that calls the `deleteTask` method of the
     * `reactionsService`.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<TasksTodoDeleteInput>`. It is an input object that
     * contains the necessary information to delete a task.
     * @returns The deleteTask function is returning an Observable.
     */
    deleteTask(
        @Payload()
        commonReactionInput: CommonReactionInput<TasksTodoDeleteInput>,
    ): Observable<any> {
        return this.reactionsService.deleteTask(commonReactionInput);
    }
}
