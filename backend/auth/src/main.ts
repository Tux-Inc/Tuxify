
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
    .setTitle('NestJS Authentication API')
    .setDescription('An OAuth2.0 authentication API made with NestJS')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addTag('Authentication API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
        host: process.env.NESTSV_AUTH_HOST || 'localhost',
        port: parseInt(process.env.NESTSV_AUTH_PORT, 10) || 3000,
    }
  })

  app.startAllMicroservices();

  await app.listen(
    configService.get<number>('port'),
    configService.get<boolean>('testing') ? '127.0.0.1' : '0.0.0.0',
  );
}

bootstrap();
