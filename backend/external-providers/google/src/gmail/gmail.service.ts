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
import { google } from "googleapis";
const MailComposer = require("nodemailer/lib/mail-composer");

@Injectable()
export class GmailService {
    public readonly topicName: string = 'projects/tuxinc-tuxify/topics/gmail';
    public readonly watchUrl: string = 'https://www.googleapis.com/gmail/v1/users/me/watch';
    public readonly logger: Logger = new Logger(GmailService.name);

    constructor(
        public readonly tokensService: TokensService,
        public readonly httpService: HttpService,
    ) {
    }

    async sendEmail(commonReactionInput: CommonReactionInput<SendEmailInput>): Promise<any> {
        const userProviderTokens: UserProviderTokens = await this.tokensService.getTokens(commonReactionInput.userId);
        const {accessToken, refreshToken} = userProviderTokens;
        const {to, from, subject, body} = commonReactionInput.input;
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
            access_token: accessToken,
        });
        const gmail = google.gmail({version: 'v1', auth: oauth2Client});
        const mailComposer = new MailComposer({
            to,
            subject,
            text: body,
            from
        });
        const message = await mailComposer.compile().build();
        const rawMessage: string = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        try {
            return await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: rawMessage,
                },
            });
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
