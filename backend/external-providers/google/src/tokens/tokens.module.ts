import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
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
  providers: [TokensService]
})
export class TokensModule {}
