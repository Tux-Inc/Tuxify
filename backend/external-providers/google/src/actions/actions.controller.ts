import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { ActionInfos } from "../dtos/action-infos.dto";
import { ActionsService } from "./actions.service";
import { GmailPubsubPublishEvent } from "./events/gmail-pubsub-publish.event";

@Controller("actions")
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableActions: ActionInfos[] = [
                {
                    name: "provider.google.action.gmail.receive",
                },
            ];
            this.natsClient.emit<ActionInfos[]>('heartbeat.providers.google.actions', availableActions);
        }, 5000);
    }

    @MessagePattern("provider.google.action.gmail.receive")
    async receiveEmail(@Payload() data: GmailPubsubPublishEvent): Promise<void> {
        return await this.actionsService.receiveEmail(data);
    }
}

