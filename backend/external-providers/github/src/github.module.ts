import { Module } from "@nestjs/common";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";
import { AuthModule } from "./auth/auth.module";
import { TokensModule } from "./tokens/tokens.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ReactionsModule } from './reactions/reactions.module';
import { ActionsModule } from './actions/actions.module';

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
        AuthModule,
        TokensModule,
        ReactionsModule,
        ActionsModule,
    ],
    controllers: [GithubController],
    providers: [GithubService],
})
export class GithubModule {
}
