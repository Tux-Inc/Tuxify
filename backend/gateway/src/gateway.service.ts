import {Inject, Injectable, Logger} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class GatewayService {
    private readonly logger: Logger = new Logger(GatewayService.name);
    constructor(
        @Inject('MAILER_SERVICE') private readonly mailerClient: ClientProxy,
    ) {}

    sendEmail(data: any) {
        this.mailerClient.emit('send_email', data);
    }
}