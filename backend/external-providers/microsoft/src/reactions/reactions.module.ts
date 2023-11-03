import { Module } from "@nestjs/common";
import { ReactionsController } from "./reactions.controller";
import { ReactionsService } from "./reactions.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { HttpModule } from "@nestjs/axios";
import { TokensService } from "../tokens/tokens.service";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "NATS_CLIENT",
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || "nats://localhost:4222"],
                },
            },
        ]),
        HttpModule,
    ],
    controllers: [ReactionsController],
    providers: [ReactionsService, TokensService],
})
export class ReactionsModule {
}
