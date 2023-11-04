/*
 * File Name: actions.service.ts
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

import { randomBytes } from "crypto";
import { HttpService } from "@nestjs/axios";
import { ClientProxy } from "@nestjs/microservices";
import { TokensService } from "../tokens/tokens.service";
import { from, lastValueFrom, map, mergeMap } from "rxjs";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { FlowActionData } from "./dtos/flow-action-data.dto";
import { TodoNotification } from "./dtos/todo-notification.dto";
import { ReactionsService } from "../reactions/reactions.service";
import { SubscribeTodoInput } from "./dtos/subscribe-todo-input.dto";
import { TasksTodoGetInput } from "src/dtos/tasks-todo-get-input.dto";
import { TasksTodoGetOutput } from "src/dtos/tasks-todo-get-output.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { CommonSubscribeInput } from "./dtos/common-subscribe-input.dto";
import { OutlookGetEmailInput } from "../dtos/outlook-get-email-input.dto";
import { SubscribeOutlookInput } from "./dtos/subscribe-outlook-input.dto";
import { OutlookGetEmailOutput } from "../dtos/outlook-get-email-output.dto";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";
import { OutlookMessageNotification } from "./dtos/outlook-message-notification.dto";

/* The ActionsService class is responsible for subscribing to Microsoft Outlook
and Microsoft Todo notifications, receiving and processing the notifications,
and emitting the processed data to a NATS client. */
@Injectable()
export class ActionsService {
    private readonly logger: Logger = new Logger(ActionsService.name);

    /**
     * The constructor function initializes the class with injected dependencies
     * for NATS client, reaction service, HTTP service, and tokens service.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator. It is used to
     * communicate with a NATS server, which is a lightweight and high-performance
     * messaging system.
     * @param {ReactionsService} reactionService - The `reactionService` parameter
     * is an instance of the `ReactionsService` class. It is used to perform
     * operations related to reactions.
     * @param {HttpService} httpService - The `httpService` parameter is an
     * instance of the `HttpService` class. It is used to make HTTP requests to
     * external APIs or services.
     * @param {TokensService} tokensService - The `tokensService` parameter is an
     * instance of the `TokensService` class. It is used to perform operations
     * related to tokens, such as generating and validating tokens.
     */
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
        private readonly reactionService: ReactionsService,
        private readonly httpService: HttpService,
        private readonly tokensService: TokensService,
    ) {}

    /**
     * The genState function generates a unique state string by concatenating a
     * random hexadecimal string with a user ID.
     * @param {number} userId - The `userId` parameter is a number that represents
     * the unique identifier of a user.
     * @returns a string that consists of a randomly generated 16-byte hexadecimal
     * string followed by a period (.) and the userId.
     */
    private genState(userId: number): string {
        try {
            return `${randomBytes(16).toString("hex")}.${userId}`;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    /**
     * The function `parseState` takes a string as input, splits it by ".", and
     * returns the last element as a number.
     * @param {string} state - The `state` parameter is a string that represents a
     * state.
     * @returns a number.
     */
    private parseState(state: string): number {
        try {
            this.logger.debug(`Parsing state ${state}`);
            const decodedState: string[] = state.split(".");
            return Number(decodedState[decodedState.length - 1]);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    /**
     * The function `subscribeToOutlook` subscribes a user to receive
     * notifications for new emails in their Outlook inbox.
     * @param csi - The parameter `csi` is of type
     * `CommonSubscribeInput<SubscribeOutlookInput>`. It is an input object that
     * contains the necessary information for subscribing to Outlook. It likely
     * includes properties such as `userId`, which represents the user for whom
     * the subscription is being created.
     * @returns a Promise that resolves to the response data from the HTTP POST
     * request to create a subscription to Outlook.
     */
    public async subscribeToOutlook(
        csi: CommonSubscribeInput<SubscribeOutlookInput>,
    ): Promise<any> {
        this.logger.debug(`Subscribing to Outlook for user ${csi.userId}`);
        return from(this.tokensService.getTokens(csi.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const state = this.genState(csi.userId);
                const payload = {
                    changeType: "created",
                    notificationUrl: `${process.env.API_BASE_URL}/providers/microsoft/action/outlook`,
                    resource: "me/mailFolders('Inbox')/messages",
                    expirationDateTime: new Date(
                        Date.now() + 86400000,
                    ).toISOString(),
                    clientState: state,
                };
                try {
                    return this.httpService.post(
                        "https://graph.microsoft.com/v1.0/subscriptions",
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map((response) => response.data),
        );
    }

    /**
     * The function `subscribeToTodo` subscribes a user to receive notifications
     * for new tasks in a specific todo task list.
     * @param csi - The parameter `csi` is of type
     * `CommonSubscribeInput<SubscribeTodoInput>`. It contains the following
     * properties:
     * @returns a Promise that resolves to any data.
     */
    public async subscribeToTodo(
        csi: CommonSubscribeInput<SubscribeTodoInput>,
    ): Promise<any> {
        this.logger.debug(`Subscribing to Todo for user ${csi.userId}`);
        return from(this.tokensService.getTokens(csi.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const state = this.genState(csi.userId);
                const payload = {
                    changeType: "created",
                    notificationUrl: `${process.env.API_BASE_URL}/providers/microsoft/action/todo`,
                    resource: `me/todo/lists/${csi.input.todoTaskListId}/tasks`,
                    expirationDateTime: new Date(
                        Date.now() + 86400000,
                    ).toISOString(),
                    clientState: state,
                };
                try {
                    return this.httpService.post(
                        "https://graph.microsoft.com/v1.0/subscriptions",
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        },
                    );
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map((response) => response.data),
        );
    }

    /**
     * The function receives an email notification from Outlook, retrieves the
     * email data, and emits a flow action event with the email data.
     * @param {OutlookMessageNotification} data - OutlookMessageNotification -
     * This is the data object that contains information about the received email
     * notification from Outlook.
     */
    public async receiveEmail(data: OutlookMessageNotification): Promise<void> {
        this.logger.debug("Received email from Outlook");
        const actionReactionInput: CommonReactionInput<OutlookGetEmailInput> = {
            userId: this.parseState(data.value[0].clientState),
            input: {
                messageId: data.value[0].resourceData.id,
            },
        };
        const emailData: OutlookGetEmailOutput =
            await lastValueFrom<OutlookGetEmailOutput>(
                this.reactionService.getEmail(actionReactionInput),
            );
        const flowActionData: FlowActionData = {
            userId: actionReactionInput.userId,
            actionName: "provider.microsoft.action.outlook",
            data: emailData,
        };
        this.natsClient.emit("flows.actions", flowActionData);
    }

    /**
     * The function receives a todo notification, retrieves the corresponding task
     * data, and emits a flow action with the task data.
     * @param {TodoNotification} data - The `data` parameter is of type
     * `TodoNotification`. It represents the data received from the Todo service.
     */
    public async receiveTodo(data: TodoNotification): Promise<void> {
        this.logger.debug("Received todo from Todo");
        const actionReactionInput: CommonReactionInput<TasksTodoGetInput> = {
            userId: this.parseState(data.clientState),
            input: {
                listId: data.resourceData.id,
                taskId: data.resourceData.id,
            },
        };
        const todoData: TasksTodoGetOutput =
            await lastValueFrom<TasksTodoGetOutput>(
                this.reactionService.getTask(actionReactionInput),
            );
        const flowActionData: FlowActionData = {
            userId: actionReactionInput.userId,
            actionName: "provider.microsoft.action.todo",
            data: todoData,
        };
        this.natsClient.emit("flows.actions", flowActionData);
    }
}
