import { Test, TestingModule } from '@nestjs/testing';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';

describe('AppController', () => {
  let appController: FlowsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FlowsController],
      providers: [FlowsService],
    }).compile();

    appController = app.get<FlowsController>(FlowsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
