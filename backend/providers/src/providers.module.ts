import {Module} from '@nestjs/common';
import {ProvidersController} from './providers.controller';
import {ProvidersService} from './providers.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from "process";
import {ProviderEntity} from "./entities/provider.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: process.env.NESTSV_PROVIDERS_POSTGRES_TYPE as any || 'postgres',
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
                    }
                }
            ]
        ),
    ],
    controllers: [ProvidersController],
    providers: [ProvidersService],
})
export class ProvidersModule {
}
