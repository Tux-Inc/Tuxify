
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {Transport} from "@nestjs/microservices";
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
        snapshot: true,
    }
  );
  const configService = app.get(ConfigService);
  app.register(fastifyCookie, {
    secret: configService.get<string>('COOKIE_SECRET'),
  });
  app.register(fastifyHelmet);
  app.register(fastifyCsrfProtection, { cookieOpts: { signed: true }, sessionPlugin: '@fastify/session' });
  app.register(fastifyCors, {
    credentials: true,
    origin: `https://${configService.get<string>('domain')}`,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tuxify Authentication API')
    .setDescription('OAuth2.0 authentication API microservice')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
        servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
    }
  })

  app.startAllMicroservices();

  await app.listen(
    configService.get<number>('port'),
    configService.get<boolean>('testing') ? 'tuxify-api-auth.production' : '0.0.0.0',
  );
}

bootstrap();
