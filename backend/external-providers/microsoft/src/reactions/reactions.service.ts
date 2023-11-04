/*
 * File Name: reactions.service.ts
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

import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { from, map, mergeMap, Observable } from "rxjs";
import { TokensService } from "../tokens/tokens.service";
import { TasksTodoInput } from "../dtos/tasks-todo-input.dto";
import { TasksListInput } from "../dtos/tasks-list-input.dto";
import { TasksTodoOutput } from "../dtos/tasks-todo-output.dto";
import { TasksListOutput } from "../dtos/tasks-list-output.dto";
import { OneNotePageInput } from "../dtos/onenote-page-input.dto";
import { OneNotePageOutput } from "../dtos/onenote-page-output.dto";
import { TasksTodoGetInput } from "src/dtos/tasks-todo-get-input.dto";
import { TasksTodoGetOutput } from "src/dtos/tasks-todo-get-output.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { TasksTodoDeleteInput } from "../dtos/tasks-todo-delete-input.dto";
import { TasksListDeleteInput } from "../dtos/tasks-list-delete-input.dto";
import { OutlookGetEmailInput } from "../dtos/outlook-get-email-input.dto";
import { OutlookGetEmailOutput } from "../dtos/outlook-get-email-output.dto";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";
import { OutlookSendEmailInput } from "../dtos/outlook-send-email-input.dto";

/* The ReactionsService class is responsible for handling various reactions
related to email, tasks, and OneNote in a Microsoft Graph API integration. */
@Injectable()
export class ReactionsService {
    private readonly logger: Logger = new Logger(ReactionsService.name);

    /**
     * The constructor function initializes private properties httpService and
     * tokensService.
     * @param {HttpService} httpService - The `httpService` parameter is an
     * instance of the `HttpService` class. It is used to make HTTP requests and
     * handle responses.
     * @param {TokensService} tokensService - The `tokensService` parameter is an
     * instance of the `TokensService` class. It is used to handle authentication
     * tokens and perform operations related to tokens, such as generating new
     * tokens, validating tokens, and refreshing tokens.
     */
    constructor(
        private readonly httpService: HttpService,
        private readonly tokensService: TokensService,
    ) {}

    /**
     * The function `getEmail` retrieves an email from Microsoft Outlook using the
     * provided message ID and user access token.
     * @param cri - CommonReactionInput<OutlookGetEmailInput> - This is an input
     * object that contains the necessary information to retrieve an email from
     * Outlook. It includes the userId and the messageId.
     * @returns an Observable of type OutlookGetEmailOutput.
     */
    getEmail(
        cri: CommonReactionInput<OutlookGetEmailInput>,
    ): Observable<OutlookGetEmailOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { messageId } = cri.input;
                return this.httpService.get<any>(
                    `https://graph.microsoft.com/v1.0/me/messages/${messageId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    },
                );
            }),
            map((response) => response.data),
            map(
                (data: any): OutlookGetEmailOutput => ({
                    from: data.from.emailAddress.address,
                    subject: data.subject,
                    body: data.body.content,
                }),
            ),
        );
    }

    /**
     * The function `getTask` retrieves a specific task from a Microsoft To-Do
     * list using the Microsoft Graph API and returns the task's title and
     * content.
     * @param cri - CommonReactionInput<TasksTodoGetInput> - This is an input
     * object that contains the necessary information to retrieve a specific task
     * from a to-do list. It includes the user ID, list ID, and task ID.
     * @returns an Observable of type TasksTodoGetOutput.
     */
    getTask(
        cri: CommonReactionInput<TasksTodoGetInput>,
    ): Observable<TasksTodoGetOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { listId, taskId } = cri.input;
                return this.httpService.get<any>(
                    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    },
                );
            }),
            map((response) => response.data),
            map(
                (data: any): TasksTodoGetOutput => ({
                    title: data.title,
                    content: data.body.content,
                }),
            ),
        );
    }

    /**
     * The function `createOneNotePage` creates a new OneNote page with the given
     * title and content using the Microsoft Graph API.
     * @param cri - CommonReactionInput<OneNotePageInput> - This is an input
     * object that contains the necessary information to create a OneNote page. It
     * includes the userId of the user creating the page and an input object of
     * type OneNotePageInput.
     * @returns The function `createOneNotePage` returns an Observable of type
     * `OneNotePageOutput`.
     */
    createOneNotePage(
        cri: CommonReactionInput<OneNotePageInput>,
    ): Observable<OneNotePageOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { title, content } = cri.input;
                const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>${title}</title>
                        <meta name="created" content="${new Date().toISOString()}">
                    </head>
                    <body>
                        ${content}
                    </body>
                </html>`;
                return this.httpService.post<any>(
                    `https://graph.microsoft.com/v1.0/me/onenote/pages?sectionName=DefaultSection`,
                    htmlContent,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: "application/json",
                            "Content-Type": "text/html",
                        },
                    },
                );
            }),
            map((response) => response.data),
            map(
                (data: any): OneNotePageOutput => ({
                    id: data.id,
                    oneNoteWebUrl: data.links.oneNoteWebUrl.href,
                    oneNoteClientUrl: data.links.oneNoteClientUrl.href,
                }),
            ),
        );
    }

    /**
     * The function `sendEmail` sends an email using the Outlook API by making a
     * POST request to the Microsoft Graph API.
     * @param cri - CommonReactionInput<OutlookSendEmailInput> - This is an input
     * object that contains the necessary information to send an email using
     * Outlook. It includes the userId of the user, as well as the email recipient
     * (to), subject, and body of the email.
     * @returns an Observable that emits the result of the HTTP POST request made
     * to the Microsoft Graph API to send an email.
     */
    sendEmail(
        cri: CommonReactionInput<OutlookSendEmailInput>,
    ): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(async (userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { to, subject, body } = cri.input;
                try {
                    return this.httpService.post<any>(
                        "https://graph.microsoft.com/v1.0/me/sendMail",
                        {
                            message: {
                                subject,
                                body: {
                                    contentType: "Text",
                                    content: body,
                                },
                                toRecipients: [
                                    {
                                        emailAddress: {
                                            address: to,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        },
                    );
                } catch (e) {
                    console.log(e.response.data);
                    this.logger.error(e);
                    throw e;
                }
            }),
        );
    }

    /**
     * The function `createTaskList` creates a new task list using the Microsoft
     * Graph API and returns the ID of the created list.
     * @param cri - CommonReactionInput<TasksListInput> - This is an input object
     * that contains the necessary information to create a task list. It includes
     * the userId and the input object which contains the displayName of the task
     * list.
     * @returns The function `createTaskList` returns an Observable of type
     * `TasksListOutput`.
     */
    createTaskList(
        cri: CommonReactionInput<TasksListInput>,
    ): Observable<TasksListOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { displayName } = cri.input;
                try {
                    return this.httpService.post<any>(
                        "https://graph.microsoft.com/v1.0/me/todo/lists",
                        {
                            displayName,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        },
                    );
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map((response) => response.data),
            map(
                (data: any): TasksListOutput => ({
                    listId: data.id,
                }),
            ),
        );
    }

    /**
     * The function `deleteTaskList` deletes a task list using the Microsoft Graph
     * API and returns the ID of the deleted list.
     * @param cri - CommonReactionInput<TasksListDeleteInput> - This is an input
     * object that contains the necessary information to delete a task list. It
     * includes the userId and the listId.
     * @returns The function `deleteTaskList` returns an Observable that emits the
     * response data from the HTTP DELETE request made to the Microsoft Graph API.
     * The response data is then mapped to a `TasksListOutput` object, which
     * contains the `listId` property extracted from the response data.
     */
    deleteTaskList(
        cri: CommonReactionInput<TasksListDeleteInput>,
    ): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { listId } = cri.input;
                try {
                    return this.httpService.delete<any>(
                        `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        },
                    );
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map((response) => response.data),
            map(
                (data: any): TasksListOutput => ({
                    listId: data.id,
                }),
            ),
        );
    }

    /**
     * The function `createTask` creates a new task in a Microsoft To-Do list
     * using the Microsoft Graph API.
     * @param cri - CommonReactionInput<TasksTodoInput> - This is an input object
     * that contains the necessary information to create a task. It includes the
     * userId of the user creating the task and the input object which contains
     * the listId, title, and content of the task.
     * @returns The function `createTask` returns an Observable of type
     * `TasksTodoOutput`.
     */
    createTask(
        cri: CommonReactionInput<TasksTodoInput>,
    ): Observable<TasksTodoOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { listId, title, content } = cri.input;
                try {
                    return this.httpService.post<any>(
                        `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
                        {
                            title,
                            body: {
                                contentType: "text",
                                content,
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        },
                    );
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map((response) => response.data),
            map(
                (data: any): TasksTodoOutput => ({
                    taskId: data.id,
                }),
            ),
        );
    }

    /**
     * The `deleteTask` function deletes a task from a Microsoft To-Do list using
     * the Microsoft Graph API.
     * @param cri - CommonReactionInput<TasksTodoDeleteInput> - This is an input
     * object that contains the necessary information to delete a task. It
     * includes the userId of the user performing the action and the input object
     * which contains the listId and taskId of the task to be deleted.
     * @returns an Observable that emits the response data from the HTTP delete
     * request.
     */
    deleteTask(
        cri: CommonReactionInput<TasksTodoDeleteInput>,
    ): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { listId, taskId } = cri.input;
                try {
                    return this.httpService.delete<any>(
                        `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${taskId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        },
                    );
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map((response) => response.data),
            map(
                (data: any): TasksTodoOutput => ({
                    taskId: data.id,
                }),
            ),
        );
    }
}
