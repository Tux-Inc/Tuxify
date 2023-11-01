/*
 * File Name: reactions.service.ts
 * Author: neptos
 * Creation Date: 2023
 *
 * Copyright (c) 2023 Tux Inc. (backend)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TokensService } from "../tokens/tokens.service";
import { from, map, mergeMap, Observable } from "rxjs";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { OneNotePageInput } from "../dtos/onenote-page-input.dto";
import { OneNotePageOutput } from "../dtos/onenote-page-output.dto";
import { OutlookSendEmailInput } from "../dtos/outlook-send-email-input.dto";

@Injectable()
export class ReactionsService {
    private readonly logger: Logger = new Logger(ReactionsService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly tokensService: TokensService,
    ) {
    }

    createOneNotePage(cri: CommonReactionInput<OneNotePageInput>): Observable<OneNotePageOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const { title, content } = cri.input;
                const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>${title}</title>
                        <meta name="created" content="${new Date().toISOString()}">
                    </head>
                    <body>
                        ${content}
                    </body>
                </html>`;
                return this.httpService.post<any>(`https://graph.microsoft.com/v1.0/me/onenote/pages?sectionName=DefaultSection`, htmlContent, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: "application/json",
                        "Content-Type": "text/html",
                    },
                });
            }),
            map(response => response.data),
            map((data: any): OneNotePageOutput => ({
                id: data.id,
                oneNoteWebUrl: data.links.oneNoteWebUrl.href,
                oneNoteClientUrl: data.links.oneNoteClientUrl.href,
            })),
        );
    }

    sendEmail(cri: CommonReactionInput<OutlookSendEmailInput>): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(async (userProviderTokens) => {
                const { accessToken } = userProviderTokens;
                const { to, subject, body } = cri.input;
                try {
                    return this.httpService.post<any>("https://graph.microsoft.com/v1.0/me/sendMail", {
                        message: {
                            subject,
                            body: {
                                contentType: "Text",
                                content: body,
                            },
                            toRecipients: [
                                {
                                    emailAddress: {
                                        address: to,
                                    },
                                },
                            ],
                        },
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    });
                } catch (e) {
                    console.log(e.response.data);
                    this.logger.error(e);
                    throw e;
                }
            }),
        );
    }

}
