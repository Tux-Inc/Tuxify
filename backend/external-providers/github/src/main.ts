import { NestFactory } from "@nestjs/core";
import { GithubModule } from "./github.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        GithubModule,
        {
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_SERVER_URL || "nats://localhost:4222"],
            },
        },
    );
    await app.listen();
}

bootstrap();
