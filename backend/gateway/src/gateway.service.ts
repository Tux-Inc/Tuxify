import {Inject, Injectable, Logger} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {CreatedUserDto} from "./created-user.dto";

@Injectable()
export class GatewayService {
    private readonly logger: Logger = new Logger(GatewayService.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {}

    sendEmail(createdUserDto: CreatedUserDto) {
        this.natsClient.emit('user.created', createdUserDto);
    }
}