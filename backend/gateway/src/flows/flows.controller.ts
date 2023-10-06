import {Controller, Inject, Post} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";

@Controller('flows')
export class FlowsController {
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    @Post()
    async createFlow() {
        return this.natsClient.send({ cmd: 'flows.create' }, {});
    }
}
