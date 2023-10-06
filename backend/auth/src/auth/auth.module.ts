import {Module} from '@nestjs/common';
import {JwtModule} from '../jwt/jwt.module';
import {UsersModule} from '../users/users.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import process from "process";

@Module({
    imports: [
        UsersModule,
        JwtModule,
        ClientsModule.register([
            {
                name: 'MAILER_SERVICE',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
                }
            },
        ]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {
}
