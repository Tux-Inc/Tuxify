import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientProxy, RpcException} from "@nestjs/microservices";

@Injectable()
export class GoogleService {
    private readonly logger: Logger = new Logger(GoogleService.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }
}
