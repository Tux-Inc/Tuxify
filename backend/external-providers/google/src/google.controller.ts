import {Controller, Inject, Logger} from '@nestjs/common';
import {GoogleService} from './google.service';
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import {ProviderInfos} from "./dtos/provider-infos.dto";
import { ActionInfos } from "./dtos/action-infos.dto";
import { ReactionInfos } from "./dtos/reaction-infos.dto";
@Controller()
export class GoogleController {
    public readonly logger: Logger = new Logger(GoogleController.name);
    public availableActions: ActionInfos[] = [];
    public availableReactions: ReactionInfos[] = [];
    constructor(
        private readonly googleService: GoogleService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const providerInfos: ProviderInfos = {
                name: "google",
                title: "Google",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                actions: this.availableActions,
                reactions: this.availableReactions,
            };
            this.natsClient.emit<ProviderInfos>('heartbeat.providers.google', providerInfos);
        }, 5000);
    }

    @EventPattern('heartbeat.providers.google.actions')
    setActionsInfos(@Payload() data: ActionInfos[]): void {
        this.availableActions = data;
    }

    @EventPattern('heartbeat.providers.google.reactions')
    setReactionsInfos(@Payload() data: ReactionInfos[]): void {
        this.availableReactions = data;
    }

}
