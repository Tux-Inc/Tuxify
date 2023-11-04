/*
File Name: calendar.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: CalendarService for CalendarService logic and routes definition
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
import { Event } from "./dtos/event.dto";
import { Injectable, Logger } from "@nestjs/common";
import { TokensService } from "../tokens/tokens.service";
import { AddEventInput } from "./dtos/add-event-input.dto";
import { calendar } from "googleapis/build/src/apis/calendar";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";

/* The CalendarService class is responsible for adding events to a calendar using
the Google Calendar API. */
@Injectable()
export class CalendarService {
    public readonly logger: Logger = new Logger(CalendarService.name);

    /**
     * The constructor function takes a TokensService object as a parameter and
     * assigns it to the tokensService property.
     * @param {TokensService} tokensService - The `tokensService` parameter is of
     * type `TokensService`. It is a dependency that is being injected into the
     * constructor of the class. The `public readonly` keywords indicate that the
     * `tokensService` property is accessible from outside the class and its value
     * cannot be modified once it is set.
     */
    constructor(public readonly tokensService: TokensService) {}

    /**
     * The function `addEvent` adds an event to a user's calendar using the Google
     * Calendar API.
     * @param commonReactionInput - The `commonReactionInput` parameter is an
     * object of type `CommonReactionInput` that contains the following
     * properties:
     * @returns the result of the `calendar.events.insert` method, which is a
     * Promise that resolves to the inserted event object.
     */
    async addEvent(
        commonReactionInput: CommonReactionInput<AddEventInput>,
    ): Promise<any> {
        const userProviderTokens: UserProviderTokens =
            await this.tokensService.getTokens(commonReactionInput.userId);
        const { accessToken, refreshToken } = userProviderTokens;
        const { calendarId } = commonReactionInput.input;
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        const resource: Event = {
            summary: commonReactionInput.input.summary,
            description: commonReactionInput.input.description,
            start: {
                dateTime: commonReactionInput.input.start,
                timeZone: "Europe/Paris",
            },
            end: {
                dateTime: commonReactionInput.input.end,
                timeZone: "Europe/Paris",
            },
        };
        try {
            return await calendar({
                version: "v3",
                auth: oauth2Client,
            }).events.insert({
                calendarId,
                requestBody: resource,
            });
        } catch (e) {
            this.logger.error(e.response.data.error);
            throw e;
        }
    }
}
