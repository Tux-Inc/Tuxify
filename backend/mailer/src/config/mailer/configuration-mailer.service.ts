/*
File Name: configuration-mailer.service.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Configuration mailer service file
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

import * as process from "process";
import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

/* The ConfigurationMailerService class is responsible for creating mailer options
based on the configuration provided. */
export class ConfigurationMailerService implements MailerOptionsFactory {
    /**
     * The function creates and returns a MailerOptions object with various
     * configuration options for sending emails.
     * @returns The function `createMailerOptions()` returns an object of type
     * `MailerOptions`.
     */
    createMailerOptions(): MailerOptions {
        return {
            transport: {
                host: process.env.NESTSV_MAILER_SMTP_HOST || "smtp.mailgun.org",
                port: parseInt(process.env.NESTSV_MAILER_SMTP_PORT, 10) || 587,
                auth: {
                    user: process.env.NESTSV_MAILER_SMTP_USER || "",
                    pass: process.env.NESTSV_MAILER_SMTP_PASSWORD || "",
                },
            },
            defaults: {
                from: process.env.NESTSV_MAILER_FROM || "",
            },
            template: {
                dir: "./templates",
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        };
    }
}
