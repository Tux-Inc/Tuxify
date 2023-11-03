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

import { Injectable } from "@nestjs/common";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { IssueInput } from "../dtos/issue-input.dto";
import { HttpService } from "@nestjs/axios";
import { IssueOutput } from "../dtos/issue-output.dto";
import { TokensService } from "../tokens/tokens.service";
import { from, map, mergeMap, Observable } from "rxjs";
import { IssueCommentInput } from "../dtos/issue-comment-input.dto";
import { IssueCommentOutput } from "../dtos/issue-comment-output.dto";
import { IssueCloseInput } from "../dtos/issue-close-input.dto";
import { IssueOpenInput } from "../dtos/issue-open-input.dto";
import { IssueCommentReactionInput } from "../dtos/issue-comment-reaction-input.dto";
import { IssueCommentReactionOutput } from "../dtos/issue-comment-reaction-output.dto";
import { IssueCommentReactionDeleteInput } from "../dtos/issue-comment-reaction-delete-input.dto";
import { BranchMergeInput } from "../dtos/branch-merge-input.dto";
import { BranchMergeOutput } from "../dtos/branch-merge-output.dto";

@Injectable()
export class ReactionsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly tokensService: TokensService,
    ) {
    }
    createIssue(cri: CommonReactionInput<IssueInput>): Observable<IssueOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const { title, body } = cri.input;
                const payload: any = {
                    title,
                    body,
                };
                return this.httpService.post<IssueOutput>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repository}/issues`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });
            }),
            map(response => response.data),
            map((data: any): IssueOutput => ({
                id: data.id,
                issue_number: data.number,
                html_url: data.html_url,
            }))
        );
    }

    createIssueComment(cri: CommonReactionInput<IssueCommentInput>): Observable<IssueCommentOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const { body } = cri.input;
                const payload: any = {
                    body,
                };

                return this.httpService.post<IssueCommentOutput>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repository}/issues/${cri.input.issue_number}/comments`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });
            }),
            map(response => response.data),
            map((data: any): IssueCommentOutput => ({
                comment_id: data.id,
                html_url: data.html_url,
            }))
        );
    }

    closeIssue(cri: CommonReactionInput<IssueCloseInput>): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const payload: any = {
                    state: 'closed',
                    state_reason: 'completed',
                }
                console.log(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/${cri.input.issue_number}`);
                return this.httpService.patch<void>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/${cri.input.issue_number}`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json',
                        "Content-Length": "0",
                    },
                });
            }),
            map(response => response.data),
        );
    }

    openIssue(cri: CommonReactionInput<IssueOpenInput>): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const payload: any = {
                    state: 'open',
                    state_reason: 'reopened',
                }
                return this.httpService.patch<void>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/${cri.input.issue_number}`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json',
                    },
                });
            }),
            map(response => response.data),
        );
    }

    createIssueCommentReaction(cri: CommonReactionInput<IssueCommentReactionInput>): Observable<IssueCommentReactionOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const payload: any = {
                    content: cri.input.content,
                }
                return this.httpService.post<void>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/comments/${cri.input.comment_id}/reactions`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json'
                    }
                });
            }),
            map(response => response.data),
            map((data: any): IssueCommentReactionOutput => ({
                reaction_id: data.id,
            }))
        );
    }

    deleteIssueCommentReaction(cri: CommonReactionInput<IssueCommentReactionDeleteInput>): Observable<any> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                return this.httpService.delete<void>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/comments/${cri.input.comment_id}/reactions/${cri.input.reaction_id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json'
                    }
                });
            }),
            map(response => response.data),
        );
    }

    mergeBranch(cri: CommonReactionInput<BranchMergeInput>): Observable<BranchMergeOutput> {
        return from(this.tokensService.getTokens(cri.userId)).pipe(
            mergeMap(userProviderTokens => {
                const { accessToken } = userProviderTokens;
                const payload: any = {
                    base: cri.input.base,
                    head: cri.input.head,
                    commit_message: cri.input.commit_message ?? 'Merged by Tuxify',
                }
                return this.httpService.post<void>(`https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/merges`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github+json'
                    }
                });
            }),
            map(response => response.data),
            map((data: any): BranchMergeOutput => ({
                sha: data.sha,
                html_url: data.html_url,
            }))
        );
    }
}
