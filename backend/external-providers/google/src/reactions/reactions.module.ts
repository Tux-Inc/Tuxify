import {Module} from '@nestjs/common';
import {ReactionsController} from './reactions.controller';
import {ReactionsService} from './reactions.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {GmailService} from "../gmail/gmail.service";
import {TokensService} from "../tokens/tokens.service";
import { HttpModule } from "@nestjs/axios";

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
        HttpModule,
    ],
    controllers: [ReactionsController],
    providers: [ReactionsService, GmailService, TokensService],
})
export class ReactionsModule {
}
