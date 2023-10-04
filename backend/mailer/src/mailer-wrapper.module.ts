import {Module} from '@nestjs/common';
import {MailerWrapperController} from './mailer-wrapper.controller';
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigurationMailerService} from "./config/mailer/configuration-mailer.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        MailerModule.forRootAsync({
            useClass: ConfigurationMailerService,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [MailerWrapperController],
})
export class MailerWrapperModule {
}
