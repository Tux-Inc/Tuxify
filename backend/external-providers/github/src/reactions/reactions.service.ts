import { Injectable } from "@nestjs/common";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { IssueInput } from "../dtos/issue-input.dto";
import { HttpService } from "@nestjs/axios";
import { IssueOutput } from "../dtos/issue-output.dto";
import { TokensService } from "../tokens/tokens.service";
import { from, map, mergeMap, Observable } from "rxjs";
import { IssueCommentInput } from "../dtos/issue-comment-input.dto";
import { IssueCommentOutput } from "../dtos/issue-comment-output.dto";

@Injectable()
export class ReactionsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly tokensService: TokensService,
    ) {
    }
    createIssue(input: CommonReactionInput<IssueInput>): Observable<IssueOutput> {
        return from(this.tokensService.getTokens(input.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const { title, body } = input.input;
                const payload: any = {
                    title,
                    body,
                };
                return this.httpService.post<IssueOutput>(`https://api.github.com/repos/${input.input.owner}/${input.input.repository}/issues`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });
            }),
            map(response => response.data),
            map((data): IssueOutput => ({
                id: data.id,
                number: data.number,
                html_url: data.html_url,
            }))
        );
    }

    createIssueComment(input: CommonReactionInput<IssueCommentInput>): Observable<IssueCommentOutput> {
        return from(this.tokensService.getTokens(input.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const { body } = input.input;
                const payload: any = {
                    body,
                };

                return this.httpService.post<IssueCommentOutput>(`https://api.github.com/repos/${input.input.owner}/${input.input.repository}/issues/${input.input.issue_number}/comments`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });
            }),
            map(response => response.data),
            map((data): IssueCommentOutput => ({
                id: data.id,
                html_url: data.html_url,
            }))
        );
    }
}
