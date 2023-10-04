import { NestFactory } from '@nestjs/core';
import { MailerWrapperModule } from './mailer-wrapper.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      MailerWrapperModule,
      {
        transport: Transport.TCP,
        options: {
            host: process.env.NESTSV_MAILER_HOST || 'localhost',
            port: parseInt(process.env.NESTSV_MAILER_PORT, 10) || 3000,
        }
      }
  );
  await app.listen();
}
bootstrap();
