/*
 * File Name: reactions.controller.ts
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

import { Controller, Inject } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { IssueInput } from "../dtos/issue-input.dto";
import { IssueOutput } from "../dtos/issue-output.dto";
import { Observable } from "rxjs";
import { IssueCommentInput } from "../dtos/issue-comment-input.dto";
import { IssueCommentOutput } from "../dtos/issue-comment-output.dto";
import { ActionReaction } from "../dtos/action-reaction.dto";
import { IssueCloseInput } from "../dtos/issue-close-input.dto";
import { IssueOpenInput } from "../dtos/issue-open-input.dto";
import { IssueCommentReactionInput } from "../dtos/issue-comment-reaction-input.dto";
import { IssueCommentReactionDeleteInput } from "../dtos/issue-comment-reaction-delete-input.dto";
import { BranchMergeInput } from "../dtos/branch-merge-input.dto";
import { BranchMergeOutput } from "../dtos/branch-merge-output.dto";

@Controller("reactions")
export class ReactionsController {
    constructor(
        public readonly reactionsService: ReactionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const availableReactions: ActionReaction[] = [
                {
                    name: "provider.github.reaction.issue.create",
                    type: "reaction",
                    title: "Create an issue",
                    description: "Create a new issue on specified repository",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repository",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "title",
                            title: "Title",
                            placeholder: "Example issue title",
                            required: true,
                        },
                        {
                            name: "body",
                            title: "Body",
                            placeholder: "Example issue body...",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "id",
                            title: "Issue ID",
                        },
                        {
                            name: "issue_number",
                            title: "Issue number",
                        },
                        {
                            name: "html_url",
                            title: "Issue URL",
                        },
                    ],
                },
                {
                    name: "provider.github.reaction.issue.comment.create",
                    type: "reaction",
                    title: "Create an issue comment",
                    description: "Create a new comment on specified issue",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repository",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "issue_number",
                            title: "Issue number",
                            placeholder: "1",
                            required: true,
                        },
                        {
                            name: "body",
                            title: "Body",
                            placeholder: "Example comment body...",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "comment_id",
                            title: "Comment ID",
                        },
                        {
                            name: "html_url",
                            title: "Comment URL",
                        },
                    ],
                },
                {
                    name: "provider.github.reaction.issue.close",
                    type: "reaction",
                    title: "Close an issue",
                    description: "Close specified issue",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repo",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "issue_number",
                            title: "Issue number",
                            placeholder: "1",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
                {
                    name: "provider.github.reaction.issue.open",
                    type: "reaction",
                    title: "Open issue",
                    description: "Open an closed specified issue",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repo",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "issue_number",
                            title: "Issue number",
                            placeholder: "1",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
                {
                    name: "provider.github.reaction.issue.comment.reaction.create",
                    type: "reaction",
                    title: "Create an issue comment reaction",
                    description: "Create a new reaction on specified issue comment",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repo",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "comment_id",
                            title: "Comment ID",
                            placeholder: "1",
                            required: true,
                        },
                        {
                            name: "content",
                            title: "Reaction",
                            placeholder: "+1/-1/laugh/confused/heart/hooray/rocket/eyes",
                            required: true,
                        },
                    ],
                    outputs: [
                        {
                            name: "reaction_id",
                            title: "Reaction ID",
                        },
                    ],
                },
                {
                    name: "provider.github.reaction.issue.comment.reaction.delete",
                    type: "reaction",
                    title: "Delete an issue comment reaction",
                    description: "Delete specified reaction on specified issue comment",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repo",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "comment_id",
                            title: "Comment ID",
                            placeholder: "1",
                            required: true,
                        },
                        {
                            name: "reaction_id",
                            title: "Reaction ID",
                            placeholder: "1",
                            required: true,
                        },
                    ],
                    outputs: [],
                },
                {
                    name: "provider.github.reaction.branch.merge",
                    type: "reaction",
                    title: "Merge branch",
                    description: "Merge specified branch into specified branch",
                    inputs: [
                        {
                            name: "owner",
                            title: "Owner",
                            placeholder: "owner",
                            required: true,
                        },
                        {
                            name: "repo",
                            title: "Repository",
                            placeholder: "repository",
                            required: true,
                        },
                        {
                            name: "base",
                            title: "Base branch",
                            placeholder: "master",
                            required: true,
                        },
                        {
                            name: "head",
                            title: "Head branch",
                            placeholder: "develop",
                            required: true,
                        },
                        {
                            name: "commit_message",
                            title: "Commit message",
                            placeholder: "Merge branch 'develop' into 'master'",
                            required: false,
                        }
                    ],
                    outputs: [
                        {
                            name: "sha",
                            title: "SHA",
                        },
                        {
                            name: "html_url",
                            title: "Merge URL",
                        },
                    ],
                },
            ];
            this.natsClient.emit<ActionReaction[]>("heartbeat.providers.github.reactions", availableReactions);
        }, 5000);
    }

    @MessagePattern("provider.github.reaction.issue.create")
    createIssue(@Payload() input: CommonReactionInput<IssueInput>): Observable<IssueOutput> {
        return this.reactionsService.createIssue(input);
    }

    @MessagePattern("provider.github.reaction.issue.comment.create")
    createIssueComment(@Payload() input: CommonReactionInput<IssueCommentInput>): Observable<IssueCommentOutput> {
        return this.reactionsService.createIssueComment(input);
    }

    @MessagePattern("provider.github.reaction.issue.close")
    closeIssue(@Payload() input: CommonReactionInput<IssueCloseInput>): Observable<any> {
        return this.reactionsService.closeIssue(input);
    }

    @MessagePattern("provider.github.reaction.issue.open")
    openIssue(@Payload() input: CommonReactionInput<IssueOpenInput>): Observable<any> {
        return this.reactionsService.openIssue(input);
    }

    @MessagePattern("provider.github.reaction.issue.comment.reaction.create")
    createIssueCommentReaction(@Payload() input: CommonReactionInput<IssueCommentReactionInput>): Observable<any> {
        return this.reactionsService.createIssueCommentReaction(input);
    }

    @MessagePattern("provider.github.reaction.issue.comment.reaction.delete")
    deleteIssueCommentReaction(@Payload() input: CommonReactionInput<IssueCommentReactionDeleteInput>): Observable<any> {
        return this.reactionsService.deleteIssueCommentReaction(input);
    }

    @MessagePattern("provider.github.reaction.branch.merge")
    mergeBranch(@Payload() input: CommonReactionInput<BranchMergeInput>): Observable<BranchMergeOutput> {
        return this.reactionsService.mergeBranch(input);
    }
}
