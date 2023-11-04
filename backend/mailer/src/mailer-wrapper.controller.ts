/*
File Name: flows.controller.spec.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Test for flows controller file
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

import { Controller, Logger } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { CreatedUserEvent } from "./event/created-user.event";
import { MailerService } from "@nestjs-modules/mailer";
import { SendEmailEvent } from "./event/send-email.event";
import { UserResetPasswordEvent } from "./event/user-reset-password.event";

/* The MailerWrapperController class is responsible for handling events related to
sending emails, such as sending confirmation emails and reset password emails. */
@Controller()
export class MailerWrapperController {
    private readonly logger: Logger = new Logger(MailerWrapperController.name);

    /**
     * The constructor function takes a mailerService parameter and assigns it to
     * the mailerService property of the class.
     * @param {MailerService} mailerService - The `mailerService` parameter is of
     * type `MailerService` and is marked as `private` and `readonly`. This means
     * that it is a private property of the class and cannot be modified once it
     * is assigned a value. It is likely used to inject an instance of the
     * `MailerService`
     */
    constructor(private readonly mailerService: MailerService) {}

    @EventPattern("email.send")
    /**
     * The function `handleSendEmail` sends an email using the provided data and
     * logs the result.
     * @param {SendEmailEvent} data - The `data` parameter is an object of type
     * `SendEmailEvent` which contains the following properties:
     */
    handleSendEmail(data: SendEmailEvent) {
        this.logger.log(`Sending email to ${data.to}`);
        this.mailerService
            .sendMail({
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
                template: data.template,
                context: data.context,
            })
            .then((): void => {
                this.logger.log(`Email sent to ${data.to}`);
            })
            .catch((error): void => {
                this.logger.error(error);
            });
    }

    @EventPattern("user.created")
    /**
     * The function handles the event of a user being created by sending a
     * confirmation email to the user's email address.
     * @param {CreatedUserEvent} data - The `data` parameter is an object of type
     * `CreatedUserEvent`. It contains information about the user that was
     * created, such as their email and a confirmation link.
     */
    handleUserCreated(data: CreatedUserEvent) {
        this.logger.log(`Sending confirmation email to ${data.email}`);
        this.mailerService
            .sendMail({
                to: data.email,
                subject: "Confirm your email",
                template: "confirm-email",
                context: {
                    link: data.confirmationLink,
                },
            })
            .then((): void => {
                this.logger.log(`Confirmation email sent to ${data.email}`);
            })
            .catch((error): void => {
                this.logger.error(error);
            });
    }

    @EventPattern("user.reset_password")
    /**
     * The function `handleUserResetPassword` sends a reset password email to the
     * specified email address with a reset link.
     * @param {UserResetPasswordEvent} data - The `data` parameter is an object of
     * type `UserResetPasswordEvent` which contains the following properties:
     */
    handleUserResetPassword(data: UserResetPasswordEvent) {
        this.logger.log(`Sending reset password email to ${data.email}`);
        this.mailerService
            .sendMail({
                to: data.email,
                subject: "Reset your password",
                template: "reset-password",
                context: {
                    link: data.resetLink,
                },
            })
            .then((): void => {
                this.logger.log(`Reset password email sent to ${data.email}`);
            })
            .catch((error): void => {
                this.logger.error(error);
            });
    }
}
