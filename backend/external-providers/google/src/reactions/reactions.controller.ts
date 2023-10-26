import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import {GmailService} from "../gmail/gmail.service";
import {SendEmailInput} from "../gmail/dtos/send-email-input.dto";
import {CommonReactionInput} from "../dtos/common-reaction-input.dto";
import { ActionReaction } from "../dtos/action-reaction.dto";

@Controller('reaction')
export class ReactionsController {
    constructor(
        public readonly gmailService: GmailService,
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
            ];
            this.natsClient.emit<ActionReaction[]>('heartbeat.providers.google.reactions', availableReactions);
        }, 5000);
    }

    @MessagePattern('provider.google.reaction.gmail.send')
    async sendEmail(@Payload() commonReactionInput: CommonReactionInput<SendEmailInput>): Promise<void> {
        return await this.gmailService.sendEmail(commonReactionInput);
    }
}
