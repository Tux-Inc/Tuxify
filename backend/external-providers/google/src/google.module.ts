import {Module} from '@nestjs/common';
import {GoogleController} from './google.controller';
import {GoogleService} from './google.service';
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
    controllers: [GoogleController],
    providers: [GoogleService],
})
export class GoogleModule {
}
