/*
File Name: main.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Main file of the authentication microservice

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import * as process from "process";
import fastifyCors from "@fastify/cors";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * The `bootstrap` function sets up a Nest.js application with Fastify as the
 * server, configures various plugins and middleware, sets up Swagger
 * documentation, connects to a NATS microservice, and starts the application
 * listening on a specified port.
 */
async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            snapshot: true,
        },
    );
    const whitelist = ["http://localhost:8080", "https://tuxify.fr"];
    const configService = app.get(ConfigService);
    app.register(fastifyCookie, {
        secret: configService.get<string>("COOKIE_SECRET"),
    });
    app.register(fastifyHelmet);
    app.register(fastifyCsrfProtection, {
        cookieOpts: { signed: true },
        sessionPlugin: "@fastify/session",
    });
    app.register(fastifyCors, {
        credentials: true,
        origin: whitelist,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Tuxify Authentication API")
        .setDescription("OAuth2.0 authentication API microservice")
        .setVersion("1.0.0")
        .addBearerAuth()
        .addTag("Authentication API")
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document);

    app.connectMicroservice({
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_SERVER_URL || "nats://localhost:4222"],
        },
    });

    app.startAllMicroservices();

    await app.listen(
        configService.get<number>("port"),
        configService.get<boolean>("testing") ? "0.0.0.0" : "0.0.0.0",
    );
}

bootstrap();
