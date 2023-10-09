import {Injectable, Logger} from '@nestjs/common';
import {SendEmailInput} from "./dtos/send-email-input.dto";
import {CommonActionInput} from "../dtos/common-action-input.dto";
import {TokensService} from "../tokens/tokens.service";
import {UserProviderTokens} from "../tokens/dtos/user-provider-tokens.dto";

@Injectable()
export class GmailService {
    public readonly logger: Logger = new Logger(GmailService.name);
    constructor(
        public readonly tokensService: TokensService,
    ) {
    }

    async sendEmail(commonActionInput: CommonActionInput<SendEmailInput>): Promise<any> {
        const userProviderTokens: UserProviderTokens = await this.tokensService.getTokens(commonActionInput.userId);
        this.logger.log("sendEmail");
        this.logger.log(userProviderTokens);
    }

}
