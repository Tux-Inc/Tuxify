import { Test, TestingModule } from '@nestjs/testing';
import { FlowsController } from './flows.controller';

describe('FlowsController', () => {
  let controller: FlowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowsController],
    }).compile();

    controller = module.get<FlowsController>(FlowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
