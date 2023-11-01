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

import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { ReactionsService } from "./reactions.service";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { OneNotePageInput } from "../dtos/onenote-page-input.dto";
import { Observable } from "rxjs";
import { OneNotePageOutput } from "../dtos/onenote-page-output.dto";
import { OutlookSendEmailInput } from "../dtos/outlook-send-email-input.dto";

@Controller('reactions')
export class ReactionsController {
    constructor(
        public readonly reactionsService: ReactionsService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
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
                            required: true
                        },
                        {
                            name: "body",
                            title: "Body",
                            placeholder: "Example email body...",
                            required: true
                        }
                    ],
                    outputs: [],
                }
            ];
            this.natsClient.emit<ActionReaction[]>("heartbeat.providers.microsoft.reactions", availableReactions);
        }, 5000);
    }

    @MessagePattern('provider.microsoft.reaction.onenote.create')
    createOneNotePage(@Payload() commonReactionInput: CommonReactionInput<OneNotePageInput>): Observable<OneNotePageOutput> {
        return this.reactionsService.createOneNotePage(commonReactionInput);
    }

    @MessagePattern('provider.microsoft.reaction.outlook.send')
    sendEmail(@Payload() commonReactionInput: CommonReactionInput<OutlookSendEmailInput>): Observable<any> {
        return this.reactionsService.sendEmail(commonReactionInput);
    }

}
