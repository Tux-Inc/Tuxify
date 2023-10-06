import { Test, TestingModule } from '@nestjs/testing';
import { FlowsService } from './flows.service';

describe('FlowsService', () => {
  let service: FlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowsService],
    }).compile();

    service = module.get<FlowsService>(FlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
