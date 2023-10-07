import {Module} from '@nestjs/common';
import {ProvidersController} from './providers.controller';
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
            ]
        ),
    ],
    controllers: [ProvidersController]
})
export class ProvidersModule {
}
