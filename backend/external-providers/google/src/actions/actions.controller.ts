import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ActionInfos } from "../dtos/action-infos.dto";
import { ActionsService } from "./actions.service";

@Controller("actions")
export class ActionsController {
    constructor(
        public readonly actionsService: ActionsService,
    ) {
    }

    @MessagePattern("provider.google.action.infos")
    receiveEmailInfos(): ActionInfos {
        return {
            name: "provider.google.action.gmail.receive",
        };
    }

    @MessagePattern("provider.google.action.gmail.receive")
    async receiveEmail(@Payload() data: any): Promise<void> {
        return await this.actionsService.receiveEmail(data);
    }
}

