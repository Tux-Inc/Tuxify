import {MailerOptions, MailerOptionsFactory} from "@nestjs-modules/mailer";
import * as process from "process";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

export class ConfigurationMailerService implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: process.env.NESTSV_MAILER_SMTP_HOST || 'smtp.mailgun.org',
        port: parseInt(process.env.NESTSV_MAILER_SMTP_PORT, 10) || 587,
        auth: {
          user: process.env.NESTSV_MAILER_SMTP_USER || '',
          pass: process.env.NESTSV_MAILER_SMTP_PASSWORD || '',
        },
      },
      defaults: {
        from: process.env.NESTSV_MAILER_SMTP_FROM || '',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        }
      }
    };
  }
}