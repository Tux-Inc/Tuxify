import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
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
