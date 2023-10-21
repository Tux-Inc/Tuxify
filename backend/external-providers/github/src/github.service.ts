import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";

@Injectable()
export class GithubService {
    private readonly logger: Logger = new Logger(GithubService.name);

    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
    }
}
