import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ActionsService {
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
    }

    public async receiveEmail(data: any): Promise<void> {
        this.natsClient.emit("flows.actions.google.gmail.receive", data);
    }
}
