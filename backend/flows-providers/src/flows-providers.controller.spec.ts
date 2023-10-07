import { Test, TestingModule } from '@nestjs/testing';
import { FlowsProvidersController } from './flows-providers.controller';
import { FlowsProvidersService } from './flows-providers.service';

describe('AppController', () => {
  let appController: FlowsProvidersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FlowsProvidersController],
      providers: [FlowsProvidersService],
    }).compile();

    appController = app.get<FlowsProvidersController>(FlowsProvidersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
