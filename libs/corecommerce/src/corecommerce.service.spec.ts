import { Test, TestingModule } from '@nestjs/testing';
import { CorecommerceService } from './corecommerce.service';

describe('CorecommerceService', () => {
  let service: CorecommerceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorecommerceService],
    }).compile();

    service = module.get<CorecommerceService>(CorecommerceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
