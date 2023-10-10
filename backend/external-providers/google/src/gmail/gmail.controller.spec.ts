import { Test, TestingModule } from '@nestjs/testing';
import { GmailController } from './gmail.controller';

describe('GmailController', () => {
  let controller: GmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmailController],
    }).compile();

    controller = module.get<GmailController>(GmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
