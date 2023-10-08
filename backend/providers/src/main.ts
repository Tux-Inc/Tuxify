import {NestFactory} from '@nestjs/core';
import {ProvidersModule} from './providers.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(ProvidersModule);
    app.connectMicroservice(
        {
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
            }
        }
    );
    await app.startAllMicroservices();
    await app.listen(process.env.NESTSV_PROVIDERS_PORT || 3000);
}

bootstrap();
