import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {
}
