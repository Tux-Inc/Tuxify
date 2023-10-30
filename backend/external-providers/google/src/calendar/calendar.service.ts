import { Injectable, Logger } from "@nestjs/common";
import { TokensService } from "../tokens/tokens.service";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { AddEventInput } from "./dtos/add-event-input.dto";
import { calendar } from "googleapis/build/src/apis/calendar";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";
import { google } from "googleapis";
import { Event } from "./dtos/event.dto";

@Injectable()
export class CalendarService {
    public readonly logger: Logger = new Logger(CalendarService.name);

    constructor(
        public readonly tokensService: TokensService,
    ) {
    }

    async addEvent(commonReactionInput: CommonReactionInput<AddEventInput>): Promise<any> {
        const userProviderTokens: UserProviderTokens = await this.tokensService.getTokens(commonReactionInput.userId);
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
            return await calendar({ version: 'v3', auth: oauth2Client }).events.insert({
                calendarId,
                requestBody: resource,
            });
        } catch (e) {
            console.log(e.response.data.error);
            throw e;
        }
    }
}
