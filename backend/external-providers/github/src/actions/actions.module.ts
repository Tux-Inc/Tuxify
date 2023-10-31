import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { HttpModule } from "@nestjs/axios";

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
  providers: [ActionsService],
  controllers: [ActionsController]
})
export class ActionsModule {}
