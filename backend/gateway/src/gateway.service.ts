import {Inject, Injectable, Logger} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {CreatedUserDto} from "./created-user.dto";

@Injectable()
export class GatewayService {
    private readonly logger: Logger = new Logger(GatewayService.name);
    constructor(
        @Inject('MAILER_SERVICE') private readonly mailerClient: ClientProxy,
    ) {}

    sendEmail(createdUserDto: CreatedUserDto) {
        this.mailerClient.emit('user_created', createdUserDto);
    }
}