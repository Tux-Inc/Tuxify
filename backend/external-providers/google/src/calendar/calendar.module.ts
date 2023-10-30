import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TokensService } from "../tokens/tokens.service";

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
  ],
  providers: [CalendarService, TokensService],
})
export class CalendarModule {}
