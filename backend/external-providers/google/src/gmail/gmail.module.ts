import {Module} from '@nestjs/common';
import {GmailService} from './gmail.service';
import {TokensService} from "../tokens/tokens.service";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_CLIENT',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
                }
            }
        ]),
    ],
    providers: [GmailService, TokensService],
})
export class GmailModule {
}
