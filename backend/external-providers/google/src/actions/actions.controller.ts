import { Controller } from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {GmailService} from "../gmail/gmail.service";
import {SendEmailInput} from "../gmail/dtos/send-email-input.dto";
import {CommonActionInput} from "../dtos/common-action-input.dto";
import {ActionInfos} from "../dtos/action-infos.dto";

@Controller('actions')
export class ActionsController {
    constructor(
        public readonly gmailService: GmailService,
    ) {
    }

    @MessagePattern('provider.google.actions.infos')
    async sendEmailInfos(): Promise<ActionInfos> {
        return {
            name: 'provider.google.actions.gmail.send',
        }
    }
    @MessagePattern('provider.google.actions.gmail.send')
    async sendEmail(@Payload() commonActionInput: CommonActionInput<SendEmailInput>): Promise<any> {
        return await this.gmailService.sendEmail(commonActionInput);
    }
}
