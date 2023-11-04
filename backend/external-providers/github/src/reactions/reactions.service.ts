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

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IssueInput } from '../dtos/issue-input.dto';
import { from, map, mergeMap, Observable } from 'rxjs';
import { IssueOutput } from '../dtos/issue-output.dto';
import { TokensService } from '../tokens/tokens.service';
import { IssueOpenInput } from '../dtos/issue-open-input.dto';
import { IssueCloseInput } from '../dtos/issue-close-input.dto';
import { BranchMergeInput } from '../dtos/branch-merge-input.dto';
import { BranchMergeOutput } from '../dtos/branch-merge-output.dto';
import { IssueCommentInput } from '../dtos/issue-comment-input.dto';
import { IssueCommentOutput } from '../dtos/issue-comment-output.dto';
import { CommonReactionInput } from '../dtos/common-reaction-input.dto';
import { IssueCommentReactionInput } from '../dtos/issue-comment-reaction-input.dto';
import { IssueCommentReactionOutput } from '../dtos/issue-comment-reaction-output.dto';
import { IssueCommentReactionDeleteInput } from '../dtos/issue-comment-reaction-delete-input.dto';

/* The ReactionsService class is responsible for handling various reactions
related to GitHub issues and comments. */
@Injectable()
export class ReactionsService {
  /**
   * The constructor function initializes private properties httpService and
   * tokensService.
   * @param {HttpService} httpService - The `httpService` parameter is an instance
   * of the `HttpService` class. It is used to make HTTP requests and handle
   * responses.
   * @param {TokensService} tokensService - The `tokensService` parameter is an
   * instance of the `TokensService` class. It is used to handle authentication
   * tokens and perform operations related to tokens, such as generating,
   * validating, and refreshing tokens.
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly tokensService: TokensService,
  ) {}

  /**
   * The `createIssue` function creates a new issue on GitHub using the provided
   * input and returns the created issue's ID, issue number, and HTML URL.
   * @param cri - CommonReactionInput<IssueInput> - This is an input object that
   * contains the necessary information to create an issue on GitHub. It includes
   * the following properties:
   * @returns The function `createIssue` returns an Observable of type
   * `IssueOutput`.
   */
  createIssue(cri: CommonReactionInput<IssueInput>): Observable<IssueOutput> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        const { title, body } = cri.input;
        const payload: any = {
          title,
          body,
        };
        return this.httpService.post<IssueOutput>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repository}/issues`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
      }),
      map((response) => response.data),
      map(
        (data: any): IssueOutput => ({
          id: data.id,
          issue_number: data.number,
          html_url: data.html_url,
        }),
      ),
    );
  }

  /**
   * The function `createIssueComment` creates a comment on a GitHub issue using
   * the provided input and user tokens.
   * @param cri - CommonReactionInput<IssueCommentInput> - This is an input object
   * that contains the necessary information to create a comment on an issue in a
   * GitHub repository. It includes the following properties:
   * @returns The function `createIssueComment` returns an Observable of type
   * `IssueCommentOutput`.
   */
  createIssueComment(
    cri: CommonReactionInput<IssueCommentInput>,
  ): Observable<IssueCommentOutput> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        const { body } = cri.input;
        const payload: any = {
          body,
        };

        return this.httpService.post<IssueCommentOutput>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repository}/issues/${cri.input.issue_number}/comments`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
      }),
      map((response) => response.data),
      map(
        (data: any): IssueCommentOutput => ({
          comment_id: data.id,
          html_url: data.html_url,
        }),
      ),
    );
  }

  /**
   * The `closeIssue` function closes a GitHub issue by sending a PATCH request to
   * the GitHub API with the necessary payload and authorization headers.
   * @param cri - The parameter `cri` is of type
   * `CommonReactionInput<IssueCloseInput>`.
   * @returns an Observable that emits the response data from the HTTP patch
   * request made to the GitHub API.
   */
  closeIssue(cri: CommonReactionInput<IssueCloseInput>): Observable<any> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        const payload: any = {
          state: 'closed',
          state_reason: 'completed',
        };
        console.log(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/${cri.input.issue_number}`,
        );
        return this.httpService.patch<void>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/${cri.input.issue_number}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
              'Content-Length': '0',
            },
          },
        );
      }),
      map((response) => response.data),
    );
  }

  /**
   * The `openIssue` function is used to reopen a GitHub issue by sending a PATCH
   * request to the GitHub API.
   * @param cri - CommonReactionInput<IssueOpenInput> - This is a generic type
   * that represents the input for opening an issue on GitHub. It contains two
   * properties:
   * @returns The function `openIssue` returns an Observable that emits the
   * response data from a PATCH request to the GitHub API.
   */
  openIssue(cri: CommonReactionInput<IssueOpenInput>): Observable<any> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        const payload: any = {
          state: 'open',
          state_reason: 'reopened',
        };
        return this.httpService.patch<void>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/${cri.input.issue_number}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
      }),
      map((response) => response.data),
    );
  }

  /**
   * The function `createIssueCommentReaction` creates a reaction on a GitHub
   * issue comment.
   * @param cri - The parameter `cri` is of type
   * `CommonReactionInput<IssueCommentReactionInput>`. It is an input object that
   * contains the necessary information to create a reaction on an issue comment.
   * @returns The function `createIssueCommentReaction` returns an Observable of
   * type `IssueCommentReactionOutput`.
   */
  createIssueCommentReaction(
    cri: CommonReactionInput<IssueCommentReactionInput>,
  ): Observable<IssueCommentReactionOutput> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        const payload: any = {
          content: cri.input.content,
        };
        return this.httpService.post<void>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/comments/${cri.input.comment_id}/reactions`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
      }),
      map((response) => response.data),
      map(
        (data: any): IssueCommentReactionOutput => ({
          reaction_id: data.id,
        }),
      ),
    );
  }

  /**
   * The function `deleteIssueCommentReaction` deletes a reaction on a GitHub
   * issue comment.
   * @param cri - CommonReactionInput<IssueCommentReactionDeleteInput> - This is
   * an input object that contains the necessary information to delete a reaction
   * on an issue comment. It includes the following properties:
   * @returns an Observable that emits the response data from the HTTP delete
   * request.
   */
  deleteIssueCommentReaction(
    cri: CommonReactionInput<IssueCommentReactionDeleteInput>,
  ): Observable<any> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        return this.httpService.delete<void>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/issues/comments/${cri.input.comment_id}/reactions/${cri.input.reaction_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
      }),
      map((response) => response.data),
    );
  }

  /**
   * The `mergeBranch` function merges two branches in a GitHub repository and
   * returns the SHA and HTML URL of the merged branch.
   * @param cri - CommonReactionInput<BranchMergeInput> - This is an input object
   * that contains the necessary information for merging branches. It includes the
   * userId, input.base (the base branch), input.head (the branch to be merged),
   * and input.commit_message (optional commit message for the merge).
   * @returns The function `mergeBranch` returns an Observable of type
   * `BranchMergeOutput`.
   */
  mergeBranch(
    cri: CommonReactionInput<BranchMergeInput>,
  ): Observable<BranchMergeOutput> {
    return from(this.tokensService.getTokens(cri.userId)).pipe(
      mergeMap((userProviderTokens) => {
        const { accessToken } = userProviderTokens;
        const payload: any = {
          base: cri.input.base,
          head: cri.input.head,
          commit_message: cri.input.commit_message ?? 'Merged by Tuxify',
        };
        return this.httpService.post<void>(
          `https://api.github.com/repos/${cri.input.owner}/${cri.input.repo}/merges`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.github+json',
            },
          },
        );
      }),
      map((response) => response.data),
      map(
        (data: any): BranchMergeOutput => ({
          sha: data.sha,
          html_url: data.html_url,
        }),
      ),
    );
  }
}
