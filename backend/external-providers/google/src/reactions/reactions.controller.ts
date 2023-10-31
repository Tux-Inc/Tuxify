import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import {GmailService} from "../gmail/gmail.service";
import {SendEmailInput} from "../gmail/dtos/send-email-input.dto";
import {CommonReactionInput} from "../dtos/common-reaction-input.dto";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { AddEventInput } from "../calendar/dtos/add-event-input.dto";
import { CalendarService } from "../calendar/calendar.service";

@Controller('reaction')
export class ReactionsController {
    constructor(
        public readonly gmailService: GmailService,
        public readonly calendarService: CalendarService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
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
                            required: true
                        },
                        {
                            name: "description",
                            title: "Description",
                            placeholder: "Example description...",
                            required: true
                        },
                        {
                            name: "start",
                            title: "Start",
                            placeholder: "2021-01-01T00:00:00-00:00",
                            required: true
                        },
                        {
                            name: "end",
                            title: "End",
                            placeholder: "2021-01-01T00:00:00-00:00",
                            required: true
                        }
                    ],
                    outputs: [],
                }
            ];
            this.natsClient.emit<ActionReaction[]>('heartbeat.providers.google.reactions', availableReactions);
        }, 5000);
    }

    @MessagePattern('provider.google.reaction.gmail.send')
    async sendEmail(@Payload() commonReactionInput: CommonReactionInput<SendEmailInput>): Promise<void> {
        return await this.gmailService.sendEmail(commonReactionInput);
    }

    @MessagePattern('provider.google.reaction.calendar.event.add')
    async addEvent(@Payload() commonReactionInput: CommonReactionInput<AddEventInput>): Promise<void> {
        return await this.calendarService.addEvent(commonReactionInput);
    }
}
