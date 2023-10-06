import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import * as process from "process";
import {DevtoolsModule} from "@nestjs/devtools-integration";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {GatewayService} from "./gateway.service";
import {GatewayController} from "./gateway.controller";

@Module({
  imports: [
      ClientsModule.register([
            {
                name: 'MAILER_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
                }
            },
          {
                name: 'AUTH_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
                }
          },
      ]),
      ConfigModule.forRoot(),
      DevtoolsModule.register({
          http: process.env.NODE_ENV !== 'production',
      }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
