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
                transport: Transport.TCP,
                options: {
                    host: process.env.NESTSV_MAILER_HOST || 'localhost',
                    port: parseInt(process.env.NESTSV_MAILER_PORT, 10) || 3000,
                }
            },
          {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.NESTSV_AUTH_HOST || 'localhost',
                    port: parseInt(process.env.NESTSV_AUTH_PORT, 10) || 3001,
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
