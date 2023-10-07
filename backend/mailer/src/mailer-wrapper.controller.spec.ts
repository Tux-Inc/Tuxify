import { Test, TestingModule } from '@nestjs/testing';
import { MailerWrapperController } from './mailer-wrapper.controller';

describe('AppController', () => {
  let appController: MailerWrapperController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailerWrapperController],
    }).compile();

    appController = app.get<MailerWrapperController>(MailerWrapperController);
  });
});
