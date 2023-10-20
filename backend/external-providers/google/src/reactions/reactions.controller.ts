import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import {GmailService} from "../gmail/gmail.service";
import {SendEmailInput} from "../gmail/dtos/send-email-input.dto";
import {CommonReactionInput} from "../dtos/common-reaction-input.dto";
import {ReactionInfos} from "../dtos/reaction-infos.dto";

@Controller('reaction')
export class ReactionsController {
    constructor(
        public readonly gmailService: GmailService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableReactions: ReactionInfos[] = [
                {
                    name: "provider.google.reaction.gmail.send",
                },
            ];
            this.natsClient.emit<ReactionInfos[]>('heartbeat.providers.google.reactions', availableReactions);
        }, 5000);
    }

    @MessagePattern('provider.google.reaction.gmail.send')
    async sendEmail(@Payload() commonReactionInput: CommonReactionInput<SendEmailInput>): Promise<void> {
        return await this.gmailService.sendEmail(commonReactionInput);
    }
}
