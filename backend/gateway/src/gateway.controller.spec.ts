import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('AppController', () => {
  let appController: GatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService],
    }).compile();

    appController = app.get<GatewayController>(GatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
