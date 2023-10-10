import { Controller } from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {GmailService} from "../gmail/gmail.service";
import {SendEmailInput} from "../gmail/dtos/send-email-input.dto";
import {CommonReactionInput} from "../dtos/common-reaction-input.dto";
import {ReactionInfos} from "../dtos/reaction-infos.dto";

@Controller('reaction')
export class ReactionsController {
    constructor(
        public readonly gmailService: GmailService,
    ) {
    }

    @MessagePattern('provider.google.reaction.infos')
    sendEmailInfos(): ReactionInfos {
        return {
            name: 'provider.google.reaction.gmail.send',
        }
    }
    @MessagePattern('provider.google.reaction.gmail.send')
    async sendEmail(@Payload() commonReactionInput: CommonReactionInput<SendEmailInput>): Promise<void> {
        return await this.gmailService.sendEmail(commonReactionInput);
    }
}
