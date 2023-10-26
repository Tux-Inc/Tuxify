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

@Controller('reactions')
export class ReactionsController {
    constructor(
        public readonly reactionsService: ReactionsService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableReactions: ActionReaction[] = [
                {
                    name: "provider.github.reaction.issue.create",
                    type: "reaction",
                    title: "Create an issue",
                    description: "Create a new issue on specified repository",
                    inputs: [
                        {
                            name: "repository",
                            title: "Repository",
                            placeholder: "owner/repository",
                            required: true,
                        }
                    ],
                    outputs: [],
                },
                {
                    name: "provider.github.reaction.issue.comment.create",
                    type: "reaction",
                    title: "Create an issue comment",
                    description: "Create a new comment on specified issue",
                    inputs: [
                        {
                            name: "repository",
                            title: "Repository",
                            placeholder: "owner/repository",
                            required: true,
                        },
                        {
                            name: "issueNumber",
                            title: "Issue number",
                            placeholder: "1",
                            required: true,
                        },
                        {
                            name: "body",
                            title: "Body",
                            placeholder: "Example comment body...",
                            required: true,
                        }
                    ],
                    outputs: [],
                },
            ];
            this.natsClient.emit<ActionReaction[]>('heartbeat.providers.github.reactions', availableReactions);
        }, 5000);
    }

    @MessagePattern('provider.github.reaction.issue.create')
    createIssue(@Payload() input: CommonReactionInput<IssueInput>): Observable<IssueOutput> {
        return this.reactionsService.createIssue(input);
    }

    @MessagePattern('provider.github.reaction.issue.comment.create')
    createIssueComment(@Payload() input: CommonReactionInput<IssueCommentInput>): Observable<IssueCommentOutput> {
        return this.reactionsService.createIssueComment(input);
    }
}
