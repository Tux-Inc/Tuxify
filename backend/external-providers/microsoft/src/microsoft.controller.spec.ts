import { Test, TestingModule } from '@nestjs/testing';
import { MicrosoftController } from './microsoft.controller';
import { MicrosoftService } from './microsoft.service';

describe('AppController', () => {
  let appController: MicrosoftController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MicrosoftController],
      providers: [MicrosoftService],
    }).compile();

    appController = app.get<MicrosoftController>(MicrosoftController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
