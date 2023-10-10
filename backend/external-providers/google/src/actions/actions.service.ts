import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ActionsService {
    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
    }

    public async receiveEmail(data: any): Promise<void> {
        try {
            const observable = this.natsClient.send("flows.actions.google.gmail.receive", data);
            const result = await observable.toPromise();
            return result;
        } catch (err) {
            return err;
        }
    }
}
