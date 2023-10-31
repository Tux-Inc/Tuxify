import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TokensService } from "../tokens/tokens.service";

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
    HttpModule,
  ],
  providers: [ReactionsService, TokensService],
  controllers: [ReactionsController]
})
export class ReactionsModule {}
