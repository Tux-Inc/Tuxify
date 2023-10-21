import { Inject, Injectable } from "@nestjs/common";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { IssueInput } from "../dtos/issue-input.dto";
import { HttpService } from "@nestjs/axios";
import { IssueOutput } from "../dtos/issue-output.dto";
import { UserProviderTokens } from "../tokens/dtos/user-provider-tokens.dto";
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

                return this.httpService.post<IssueOutput>(`https://api.github.com/repos/${input.input.owner}/${input.input.repo}/issues`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }),
            map(response => response.data)
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

                return this.httpService.post<IssueCommentOutput>(`https://api.github.com/repos/${input.input.owner}/${input.input.repo}/issues/${input.input.issue_number}/comments`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }),
            map(response => response.data)
        );
    }
}
