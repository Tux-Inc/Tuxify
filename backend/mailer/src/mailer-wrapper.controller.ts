import {Controller, Logger} from '@nestjs/common';
import {EventPattern} from "@nestjs/microservices";
import {CreatedUserEvent} from "./event/created-user.event";
import {MailerService} from "@nestjs-modules/mailer";
import {SendEmailEvent} from "./event/send-email.event";
import {UserResetPasswordEvent} from "./event/user-reset-password.event";

@Controller()
export class MailerWrapperController {
    private readonly logger: Logger = new Logger(MailerWrapperController.name);
    constructor(
        private readonly mailerService: MailerService,
    ) {}

    @EventPattern('send_email')
    handleSendEmail(data: SendEmailEvent) {
        this.mailerService.sendMail({
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
            template: data.template,
            context: data.context,
        }).then((): void => {
            this.logger.log(`Email sent to ${data.to}`);
        }).catch((error): void => {
            this.logger.error(error);
        });
    }

    @EventPattern('user_created')
    handleUserCreated(data: CreatedUserEvent) {
        this.mailerService.sendMail({
            to: data.email,
            subject: 'Confirm your email',
            template: 'confirm-email',
            context: {
                link: data.confirmationLink,
            },
        }).then((): void => {
            this.logger.log(`Confirmation email sent to ${data.email}`);
        }).catch((error): void => {
            this.logger.error(error);
        });
    }

    @EventPattern('user_reset_password')
    handleUserResetPassword(data: UserResetPasswordEvent) {
        this.mailerService.sendMail({
            to: data.email,
            subject: 'Reset your password',
            template: 'reset-password',
            context: {
                link: data.resetLink,
            },
        }).then((): void => {
            this.logger.log(`Reset password email sent to ${data.email}`);
        }).catch((error): void => {
            this.logger.error(error);
        });
    }
}
