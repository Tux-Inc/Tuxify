import {Controller, Inject, Logger} from '@nestjs/common';
import {GoogleService} from './google.service';
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { ActionReaction } from "./dtos/action-reaction.dto";
import { ActionReactionService } from "./dtos/action-reaction-service.dto";
@Controller()
export class GoogleController {
    public readonly logger: Logger = new Logger(GoogleController.name);
    public availableActions: ActionReaction[] = [];
    public availableReactions: ActionReaction[] = [];
    constructor(
        private readonly googleService: GoogleService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval(() => {
            const providerInfos: ActionReactionService = {
                name: "google",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                title: "Google",
                description: "Google service including Gmail, Sheets, Docs and many more...",
                actions: this.availableActions,
                reactions: this.availableReactions,
            };
            this.natsClient.emit<ActionReactionService>('heartbeat.providers.google', providerInfos);
        }, 5000);
    }

    @EventPattern('heartbeat.providers.google.actions')
    setActionsInfos(@Payload() data: ActionReaction[]): void {
        this.availableActions = data;
    }

    @EventPattern('heartbeat.providers.google.reactions')
    setReactionsInfos(@Payload() data: ActionReaction[]): void {
        this.availableReactions = data;
    }

}
