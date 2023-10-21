import { Controller, Inject } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { ReactionInfos } from "../dtos/reaction-infos.dto";
import { CommonReactionInput } from "../dtos/common-reaction-input.dto";
import { IssueInput } from "../dtos/issue-input.dto";
import { IssueOutput } from "../dtos/issue-output.dto";
import { Observable } from "rxjs";
import { IssueCommentInput } from "../dtos/issue-comment-input.dto";
import { IssueCommentOutput } from "../dtos/issue-comment-output.dto";

@Controller('reactions')
export class ReactionsController {
    constructor(
        public readonly reactionsService: ReactionsService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableReactions: ReactionInfos[] = [
                {
                    name: "provider.github.reaction.issue.create",
                },
                {
                    name: "provider.github.reaction.issue.comment.create",
                },
            ];
            this.natsClient.emit<ReactionInfos[]>('heartbeat.providers.github.reactions', availableReactions);
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
