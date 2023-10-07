import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import * as process from "process";
import {DevtoolsModule} from "@nestjs/devtools-integration";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {GatewayService} from "./gateway.service";
import {GatewayController} from "./gateway.controller";
import { FlowsModule } from './flows/flows.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
      ClientsModule.register([
        {
            name: 'NATS_CLIENT',
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
      FlowsModule,
      ProvidersModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
