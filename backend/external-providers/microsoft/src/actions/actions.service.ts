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

import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { OutlookMessageNotification } from "./dtos/outlook-message-notification.dto";
import { randomBytes } from "crypto";
import { FlowActionData } from "./dtos/flow-action-data.dto";
import { ReactionsService } from "../reactions/reactions.service";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { OutlookGetEmailInput } from "../dtos/outlook-get-email-input.dto";
import { from, lastValueFrom, map, mergeMap } from "rxjs";
import { OutlookGetEmailOutput } from "../dtos/outlook-get-email-output.dto";
import { HttpService } from "@nestjs/axios";
import { TokensService } from "../tokens/tokens.service";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";
import { SubscribeOutlookInput } from "./dtos/subscribe-outlook-input.dto";
import { SubscribeTodoInput } from "./dtos/subscribe-todo-input.dto";
import { CommonSubscribeInput } from "./dtos/common-subscribe-input.dto";
import { TodoNotification } from "./dtos/todo-notification.dto";
import { TasksTodoGetInput } from "src/dtos/tasks-todo-get-input.dto";
import { TasksTodoGetOutput } from "src/dtos/tasks-todo-get-output.dto";

@Injectable()
export class ActionsService {
    private readonly logger: Logger = new Logger(ActionsService.name);
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
        private readonly reactionService: ReactionsService,
        private readonly httpService: HttpService,
        private readonly tokensService: TokensService,
    ) {
    }

    private genState(userId: number): string {
        try {
            return `${randomBytes(16).toString('hex')}.${userId}`;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    private parseState(state: string): number {
        try {
            this.logger.debug(`Parsing state ${state}`);
            const decodedState: string[] = state.split('.');
            return Number(decodedState[decodedState.length - 1]);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async subscribeToOutlook(csi: CommonSubscribeInput<SubscribeOutlookInput>): Promise<any> {
        this.logger.debug(`Subscribing to Outlook for user ${csi.userId}`);
        return from(this.tokensService.getTokens(csi.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const state = this.genState(csi.userId);
                const payload = {
                    changeType: "created",
                    notificationUrl: `${process.env.API_BASE_URL}/providers/microsoft/action/outlook`,
                    resource: "me/mailFolders('Inbox')/messages",
                    expirationDateTime: new Date(Date.now() + 86400000).toISOString(),
                    clientState: state,
                }
                try {
                    return this.httpService.post("https://graph.microsoft.com/v1.0/subscriptions", payload, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map(response => response.data),
        );
    }

    public async subscribeToTodo(csi: CommonSubscribeInput<SubscribeTodoInput>): Promise<any> {
        this.logger.debug(`Subscribing to Todo for user ${csi.userId}`);
        return from(this.tokensService.getTokens(csi.userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const state = this.genState(csi.userId);
                const payload = {
                    changeType: "created",
                    notificationUrl: `${process.env.API_BASE_URL}/providers/microsoft/action/todo`,
                    resource: `me/todo/lists/${csi.input.todoTaskListId}/tasks`,
                    expirationDateTime: new Date(Date.now() + 86400000).toISOString(),
                    clientState: state,
                }
                try {
                    return this.httpService.post("https://graph.microsoft.com/v1.0/subscriptions", payload, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                } catch (e) {
                    this.logger.error(e);
                    throw e;
                }
            }),
            map(response => response.data),
        );
    }

    public async receiveEmail(data: OutlookMessageNotification): Promise<void> {
        this.logger.debug("Received email from Outlook");
        const actionReactionInput: CommonReactionInput<OutlookGetEmailInput> = {
            userId: this.parseState(data.value[0].clientState),
            input: {
                messageId: data.value[0].resourceData.id,
            },
        }
        const emailData: OutlookGetEmailOutput = await lastValueFrom<OutlookGetEmailOutput>(this.reactionService.getEmail(actionReactionInput));
        const flowActionData: FlowActionData = {
            userId: actionReactionInput.userId,
            actionName: "provider.microsoft.action.outlook",
            data: emailData,
        }
        this.natsClient.emit("flows.actions", flowActionData);
    }

    public async receiveTodo(data: TodoNotification): Promise<void> {
        this.logger.debug("Received todo from Todo");
        const actionReactionInput: CommonReactionInput<TasksTodoGetInput> = {
            userId: this.parseState(data.clientState),
            input: {
                listId: data.resourceData.id,
                taskId: data.resourceData.id,
            },
        }
        const todoData: TasksTodoGetOutput = await lastValueFrom<TasksTodoGetOutput>(this.reactionService.getTask(actionReactionInput));
        const flowActionData: FlowActionData = {
            userId: actionReactionInput.userId,
            actionName: "provider.microsoft.action.todo",
            data: todoData,
        }
        this.natsClient.emit("flows.actions", flowActionData);
    }
}
