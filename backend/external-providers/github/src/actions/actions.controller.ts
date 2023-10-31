import { Controller, Inject } from "@nestjs/common";
import { ActionsService } from "./actions.service";
import { ClientProxy } from "@nestjs/microservices";
import { ActionReaction } from "../dtos/action-reaction.dto";

@Controller('actions')
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableActions: ActionReaction[] = [
                {
                    name: "provider.github.action.issue.create",
                    type: "action",
                    title: "Issue created",
                    description: "Trigger when a new issue is created",
                    inputs: [
                        {
                            name: "repository",
                            title: "Repository",
                            placeholder: "owner/repository",
                            required: true,
                        }
                    ],
                    outputs: [
                        {
                            name: "issueNumber",
                            title: "Issue number",
                        },
                        {
                            name: "title",
                            title: "Title",
                        },
                        {
                            name: "body",
                            title: "Body",
                        }
                    ],
                },
            ];
            this.natsClient.emit<ActionReaction>('heartbeat.providers.github.actions', availableActions);
        }, 5000);
    }

}
