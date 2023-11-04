/*
File Name: gmail.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: GmailService for GmailService logic and routes definition
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

import { google } from "googleapis";
import { lastValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { Payload } from "@nestjs/microservices";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TokensService } from "../tokens/tokens.service";
import { ProviderEntity } from "../auth/dtos/provider.dto";
import { SendEmailInput } from "./dtos/send-email-input.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";

const MailComposer = require("nodemailer/lib/mail-composer");

/* The GmailService class is responsible for sending emails and managing user
subscriptions to Gmail publishers. */
@Injectable()
export class GmailService {
    public readonly topicName: string = "projects/tuxinc-tuxify/topics/gmail";
    public readonly watchUrl: string =
        "https://www.googleapis.com/gmail/v1/users/me/watch";
    public readonly logger: Logger = new Logger(GmailService.name);

    /**
     * The constructor function initializes the tokensService and httpService
     * properties with the provided parameters.
     * @param {TokensService} tokensService - The `tokensService` parameter is of
     * type `TokensService`. It is a service that is responsible for managing
     * tokens, such as authentication tokens or access tokens.
     * @param {HttpService} httpService - The `httpService` parameter is an
     * instance of the `HttpService` class. It is used to make HTTP requests and
     * handle responses.
     */
    constructor(
        public readonly tokensService: TokensService,
        public readonly httpService: HttpService,
    ) {}

    /**
     * The `sendEmail` function sends an email using the Gmail API in TypeScript,
     * using the provided user tokens and email details.
     * @param commonReactionInput - The `commonReactionInput` parameter is an
     * object of type `CommonReactionInput<SendEmailInput>`. It contains the
     * necessary information for sending an email, such as the user ID, email
     * recipient, sender, subject, and body.
     * @returns the result of the `gmail.users.messages.send` method, which is a
     * Promise that resolves to the response from the Gmail API.
     */
    async sendEmail(
        commonReactionInput: CommonReactionInput<SendEmailInput>,
    ): Promise<any> {
        const userProviderTokens: UserProviderTokens =
            await this.tokensService.getTokens(commonReactionInput.userId);
        const { accessToken, refreshToken } = userProviderTokens;
        const { to, from, subject, body } = commonReactionInput.input;
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
            access_token: accessToken,
        });
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const mailComposer = new MailComposer({
            to,
            subject,
            text: body,
            from,
        });
        const message = await mailComposer.compile().build();
        const rawMessage: string = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        try {
            return await gmail.users.messages.send({
                userId: "me",
                requestBody: {
                    raw: rawMessage,
                },
            });
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: "addUsersToPublishers" })
    /**
     * The function "addUsersToPublishers" asynchronously adds users to publishers
     * by iterating through a list of provider entities and calling the
     * "addUserToPublisher" function for each entity.
     */
    async addUsersToPublishers(): Promise<void> {
        const providerEntities: ProviderEntity[] =
            await this.tokensService.getAllTokens();
        for (const providerEntity of providerEntities) {
            await this.addUserToPublisher(providerEntity);
        }
    }

    /**
     * The function `addUserToPublisher` adds a user to Gmail publishers using the
     * provided user provider tokens.
     * @param {UserProviderTokens} userProviderTokens - The `userProviderTokens`
     * parameter is an object that contains the user's provider tokens. It likely
     * includes properties such as `userId` (the user's unique identifier) and
     * `accessToken` (the access token required for authentication with the Gmail
     * API).
     */
    async addUserToPublisher(
        @Payload() userProviderTokens: UserProviderTokens,
    ): Promise<void> {
        this.logger.log(
            `Adding user ${userProviderTokens.userId} to gmail publishers`,
        );
        try {
            await lastValueFrom<AxiosResponse>(
                this.httpService.post(
                    this.watchUrl,
                    {
                        topicName: this.topicName,
                        labelIds: ["UNREAD"],
                        labelFilterAction: "include",
                    },
                    {
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
        this.logger.log(
            `Added user ${userProviderTokens.userId} to gmail publishers`,
        );
    }
}
