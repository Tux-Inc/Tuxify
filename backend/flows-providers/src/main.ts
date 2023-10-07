import {NestFactory} from '@nestjs/core';
import {FlowsProvidersModule} from './flows-providers.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(FlowsProvidersModule);
    app.connectMicroservice(
        {
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
            }
        }
    );
    await app.startAllMicroservices();
    await app.listen(process.env.NESTSV_FLOWSPROVIDERS_PORT || 3000);
}

bootstrap();
