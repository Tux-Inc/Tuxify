import {Module} from '@nestjs/common';
import {GoogleService} from './google.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {AuthModule} from './auth/auth.module';
import {ReactionsModule} from './reactions/reactions.module';
import { GmailModule } from './gmail/gmail.module';
import { TokensModule } from './tokens/tokens.module';
import { ActionsModule } from './actions/actions.module';
import {GoogleController} from './google.controller';
import { CalendarModule } from './calendar/calendar.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NATS_CLIENT',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_SERVER_URL || 'nats://localhost:4222'],
                }
            }
        ]),
        AuthModule,
        ActionsModule,
        ReactionsModule,
        GmailModule,
        TokensModule,
        CalendarModule,
    ],
    controllers: [GoogleController],
    providers: [GoogleService],
})
export class GoogleModule {
}
