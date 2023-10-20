import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { GithubService } from './github.service';
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { ProviderInfos } from "./dtos/provider-infos.dto";
import { ActionInfos } from "./dtos/action-infos.dto";
import { ReactionInfos } from "./dtos/reaction-infos.dto";

@Controller()
export class GithubController {
  public readonly logger: Logger = new Logger(GithubController.name);
  public availableActions: ActionInfos[] = [];
  public availableReactions: ReactionInfos[] = [];
  constructor(
      private readonly githubService: GithubService,
      @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {
    setInterval(() => {
      const providerInfos: ProviderInfos = {
        name: "github",
        title: "Github",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
        actions: this.availableActions,
        reactions: this.availableReactions,
      };
      this.natsClient.emit<ProviderInfos>('heartbeat.providers.github', providerInfos);
    }, 5000);
  }

  @EventPattern('heartbeat.providers.github.actions')
  setActionsInfos(@Payload() data: ActionInfos[]): void {
    this.availableActions = data;
  }

  @EventPattern('heartbeat.providers.github.reactions')
  setReactionsInfos(@Payload() data: ReactionInfos[]): void {
    this.availableReactions = data;
  }
}
