import { Module } from '@nestjs/common';
import { FlowsProvidersController } from './flows-providers.controller';
import { FlowsProvidersService } from './flows-providers.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "process";
import {FlowProviderEntity} from "./entities/flow-provider.entity";

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: process.env.NESTSV_FLOWSPROVIDERS_POSTGRES_TYPE as any || 'postgres',
        host: process.env.NESTSV_FLOWSPROVIDERS_POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.NESTSV_FLOWSPROVIDERS_POSTGRES_PORT || '5432'),
        username: process.env.NESTSV_FLOWSPROVIDERS_POSTGRES_USER || 'postgres',
        password: process.env.NESTSV_FLOWSPROVIDERS_POSTGRES_PASSWORD || 'postgres',
        database: process.env.NESTSV_FLOWSPROVIDERS_POSTGRES_DB || 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([FlowProviderEntity]),
  ],
  controllers: [FlowsProvidersController],
  providers: [FlowsProvidersService],
})
export class FlowsProvidersModule {}
