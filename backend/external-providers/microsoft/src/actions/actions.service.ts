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
        return `${randomBytes(16).toString('hex')}.${userId}`;
    }

    private parseState(state: string): { nonce: string, userId: number } {
        const [nonce, userId] = state.split('.');
        return { nonce, userId: Number(userId) };
    }

    public async subscribeToReceiveEmail(userId: number): Promise<any> {
        return from(this.tokensService.getTokens(userId)).pipe(
            mergeMap((userProviderTokens: UserProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const state = this.genState(userId);
                const payload = {
                    changeType: "created",
                    notificationUrl: `${process.env.API_BASE_URL}/webhooks/microsoft/outlook`,
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

    public async receiveEmail(data: OutlookMessageNotification): Promise<void> {
        this.logger.debug("Received email from Outlook");
        const actionReactionInput: CommonReactionInput<OutlookGetEmailInput> = {
            userId: this.parseState(data.clientState).userId,
            input: {
                messageId: data.resource,
            },
        }
        const emailData: OutlookGetEmailOutput = await lastValueFrom<OutlookGetEmailOutput>(this.reactionService.getEmail(actionReactionInput));
        const flowActionData: FlowActionData = {
            userId: actionReactionInput.userId,
            actionName: "provider.microsoft.action.outlook.message",
            data: emailData,
        }
        this.natsClient.emit("flows.actions", flowActionData);
    }
}
