/*
File Name: reactions.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: ReactionsController for ReactionsController logic and routes definition
Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { Controller, Inject } from "@nestjs/common";
import { GmailService } from "../gmail/gmail.service";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { CalendarService } from "../calendar/calendar.service";
import { AddEventInput } from "../calendar/dtos/add-event-input.dto";
import { SendEmailInput } from "../gmail/dtos/send-email-input.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";

/* The ReactionsController class is responsible for handling reactions related to
Gmail and Google Calendar services. */
@Controller("reaction")
export class ReactionsController {
    /**
     * The constructor function periodically emits available reactions to a NATS
     * client for a Google provider.
     * @param {GmailService} gmailService - An instance of the GmailService class,
     * which provides methods for interacting with the Gmail API.
     * @param {CalendarService} calendarService - The `calendarService` parameter
     * is an instance of the `CalendarService` class. It is used to interact with
     * the Google Calendar API and perform operations such as adding events to the
     * calendar.
     * @param {ClientProxy} natsClient - The `natsClient` parameter is of type
     * `ClientProxy` and is injected using the `@Inject` decorator. It is used to
     * emit a heartbeat event to the NATS server every 5 seconds. The emitted
     * event contains an array of available reactions that can be triggered by the
     * Google provider
     */
    constructor(
        public readonly gmailService: GmailService,
        public readonly calendarService: CalendarService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const availableReactions: ActionReaction[] = [
                {
                    name: "provider.google.reaction.gmail.send",
                    type: "reaction",
                    title: "Send an email",
                    description: "Send a new email from your Gmail account",
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
                    name: "provider.google.reaction.calendar.event.add",
                    type: "reaction",
                    title: "Add an event",
                    description: "Add an event to your Google Calendar",
                    inputs: [
                        {
                            name: "calendarId",
                            title: "Calendar ID",
                            placeholder: "primary",
                            required: true,
                        },
                        {
                            name: "summary",
                            title: "Summary",
                            placeholder: "Example summary",
                            required: true,
                        },
                        {
                            name: "description",
                            title: "Description",
                            placeholder: "Example description...",
                            required: true,
                        },
                        {
                            name: "start",
                            title: "Start",
                            placeholder: "2021-01-01T00:00:00-00:00",
                            required: true,
                        },
                        {
                            name: "end",
                            title: "End",
                            placeholder: "2021-01-01T00:00:00-00:00",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
            ];
            this.natsClient.emit<ActionReaction[]>(
                "heartbeat.providers.google.reactions",
                availableReactions,
            );
        }, 5000);
    }

    @MessagePattern("provider.google.reaction.gmail.send")
    /**
     * The function `sendEmail` is an asynchronous function that takes a
     * `commonReactionInput` parameter and uses the `gmailService` to send an
     * email.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<SendEmailInput>`. It is an input object that contains
     * the necessary data for sending an email. The `SendEmailInput` is a generic
     * type that specifies the specific data required for sending an email.
     * @returns a Promise that resolves to void.
     */
    async sendEmail(
        @Payload() commonReactionInput: CommonReactionInput<SendEmailInput>,
    ): Promise<void> {
        return await this.gmailService.sendEmail(commonReactionInput);
    }

    @MessagePattern("provider.google.reaction.calendar.event.add")
    /**
     * The function `addEvent` takes a `commonReactionInput` and calls the
     * `addEvent` method of the `calendarService` with that input.
     * @param commonReactionInput - The `commonReactionInput` parameter is of type
     * `CommonReactionInput<AddEventInput>`. It is an input object that contains
     * the necessary data for adding an event to a calendar. The `AddEventInput`
     * type specifies the specific data fields required for adding an event.
     * @returns a Promise that resolves to void.
     */
    async addEvent(
        @Payload() commonReactionInput: CommonReactionInput<AddEventInput>,
    ): Promise<void> {
        return await this.calendarService.addEvent(commonReactionInput);
    }
}
