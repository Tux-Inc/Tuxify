import { Controller, Inject } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { ReactionInfos } from "../dtos/reaction-infos.dto";

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
            ];
            this.natsClient.emit<ReactionInfos[]>('heartbeat.providers.github.reactions', availableReactions);
        }, 5000);
    }

    @MessagePattern('provider.github.reaction.issue.create')
    async createIssue(): Promise<void> {
        return await this.reactionsService.createIssue();
    }
}
