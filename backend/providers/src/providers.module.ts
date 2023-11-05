/*
File Name: action-reaction-input.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: The `ActionReactionInput` class represents an input field with properties for
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

import * as process from 'process';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProviderEntity } from './entities/provider.entity';
import { ProvidersController } from './providers.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.NESTSV_PROVIDERS_POSTGRES_TYPE as any) || 'postgres',
      host: process.env.NESTSV_PROVIDERS_POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.NESTSV_PROVIDERS_POSTGRES_PORT || '5432'),
      username: process.env.NESTSV_PROVIDERS_POSTGRES_USER || 'postgres',
      password: process.env.NESTSV_PROVIDERS_POSTGRES_PASSWORD || 'postgres',
      database: process.env.NESTSV_PROVIDERS_POSTGRES_DB || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProviderEntity]),
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})

/* The ProvidersModule class is exported. */
export class ProvidersModule {}
