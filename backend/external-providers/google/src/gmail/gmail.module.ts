import { Module } from "@nestjs/common";
import { GmailService } from "./gmail.service";
import { TokensService } from "../tokens/tokens.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { GmailController } from './gmail.controller';

@Module({
    imports: [
        HttpModule,
        ScheduleModule.forRoot(),
        ClientsModule.register([
            {
                name: "NATS_CLIENT",
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || "nats://localhost:4222"],
                },
            },
        ]),
    ],
    providers: [GmailService, TokensService],
    controllers: [GmailController],
})
export class GmailModule {
}
