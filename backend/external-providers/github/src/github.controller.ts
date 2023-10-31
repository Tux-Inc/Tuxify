import { Controller, Inject, Logger } from "@nestjs/common";
import { GithubService } from './github.service';
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { ActionReactionService } from "./dtos/action-reaction-service.dto";
import { ActionReaction } from "./dtos/action-reaction.dto";

@Controller()
export class GithubController {
  public readonly logger: Logger = new Logger(GithubController.name);
  public availableActions: ActionReaction[] = [];
  public availableReactions: ActionReaction[] = [];
  constructor(
      private readonly githubService: GithubService,
      @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {
    setInterval(() => {
      const providerInfos: ActionReactionService = {
        name: "github",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
        title: "Github",
        description: "Github is a place for developer to share and discover code",
        actions: this.availableActions,
        reactions: this.availableReactions,
      };
      this.natsClient.emit<ActionReactionService>('heartbeat.providers.github', providerInfos);
    }, 5000);
  }

  @EventPattern('heartbeat.providers.github.actions')
  setActionsInfos(@Payload() data: ActionReaction[]): void {
    this.availableActions = data;
  }

  @EventPattern('heartbeat.providers.github.reactions')
  setReactionsInfos(@Payload() data: ActionReaction[]): void {
    this.availableReactions = data;
  }
}
