import { NestFactory } from '@nestjs/core';
import { MailerWrapperModule } from './mailer-wrapper.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      MailerWrapperModule,
      {
        snapshot: true,
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
        }
      }
  );
  await app.listen();
}
bootstrap();
