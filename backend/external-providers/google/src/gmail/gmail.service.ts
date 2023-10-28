import { Injectable, Logger } from "@nestjs/common";
import { SendEmailInput } from "./dtos/send-email-input.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { TokensService } from "../tokens/tokens.service";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { Payload } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { ProviderEntity } from "../auth/dtos/provider.dto";

@Injectable()
export class GmailService {
    public readonly topicName: string = 'projects/tuxinc-tuxify/topics/gmail';
    public readonly watchUrl: string = 'https://www.googleapis.com/gmail/v1/users/me/watch';
    public readonly sendUrl: string = 'https://www.googleapis.com/gmail/v1/users/me/messages/send';
    public readonly logger: Logger = new Logger(GmailService.name);

    constructor(
        public readonly tokensService: TokensService,
        public readonly httpService: HttpService,
    ) {
    }

    async sendEmail(commonReactionInput: CommonReactionInput<SendEmailInput>): Promise<any> {
        const userProviderTokens: UserProviderTokens = await this.tokensService.getTokens(commonReactionInput.userId);
        const {accessToken} = userProviderTokens;
        const {to, subject, body} = commonReactionInput.input;
        const message: string = `From: "Tuxify" <
        To: ${to}
        Subject: ${subject}
        Content-Type: text/html; charset=utf-8
        MIME-Version: 1.0
        ${body}
        `;
        const encodedMessage: string = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const payload: any = {
            raw: encodedMessage,
        }
        try {
            const res = await lastValueFrom<AxiosResponse>(
                this.httpService.post(this.sendUrl, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
            );
            console.log(res);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'addUsersToPublishers' })
    async addUsersToPublishers(): Promise<void> {
        const providerEntities: ProviderEntity[] = await this.tokensService.getAllTokens();
        for (const providerEntity of providerEntities) {
            await this.addUserToPublisher(providerEntity);
        }
    }

    async addUserToPublisher(@Payload() userProviderTokens: UserProviderTokens): Promise<void> {
        this.logger.log(`Adding user ${userProviderTokens.userId} to gmail publishers`);
        try {
            await lastValueFrom<AxiosResponse>(
                this.httpService.post(this.watchUrl, {
                        topicName: this.topicName,
                        labelIds: ["UNREAD"],
                        labelFilterAction: "include",
                    }, {
                        headers: {
                            Authorization: `Bearer ${userProviderTokens.accessToken}`,
                        },
                    },
                ),
            );
        } catch (e) {
            console.log(e.response.data);
            this.logger.error(e.message);
            throw e;
        }
        this.logger.log(`Added user ${userProviderTokens.userId} to gmail publishers`);
    }

}
