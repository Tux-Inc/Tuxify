import { Controller, Inject } from "@nestjs/common";
import { ActionsService } from "./actions.service";
import { ClientProxy } from "@nestjs/microservices";
import { ActionInfos } from "../dtos/action-infos.dto";

@Controller('actions')
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
        setInterval( () => {
            const availableActions: ActionInfos[] = [
                {
                    name: "provider.github.action.issue.create",
                }
            ];
            this.natsClient.emit<ActionInfos>('heartbeat.providers.github.actions', availableActions);
        }, 5000);
    }

}
