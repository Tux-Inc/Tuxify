import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { ActionsService } from "./actions.service";
import { GmailPubsubPublishEvent } from "./events/gmail-pubsub-publish.event";
import { ActionReaction } from "../dtos/action-reaction.dto";

@Controller("actions")
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableActions: ActionReaction[] = [
                {
                    name: "provider.google.action.gmail.receive",
                    type: "action",
                    title: "Receive an email",
                    description: "Triggered when a new email is received on your Gmail account",
                    inputs: [],
                    outputs: [
                        {
                            name: "from",
                            title: "From",
                        },
                        {
                            name: "subject",
                            title: "Subject",
                        },
                        {
                            name: "body",
                            title: "Body"
                        }
                    ],
                },
            ];
            this.natsClient.emit<ActionReaction[]>('heartbeat.providers.google.actions', availableActions);
        }, 5000);
    }

    @MessagePattern("provider.google.action.gmail.receive")
    async receiveEmail(@Payload() data: GmailPubsubPublishEvent): Promise<void> {
        return await this.actionsService.receiveEmail(data);
    }
}

