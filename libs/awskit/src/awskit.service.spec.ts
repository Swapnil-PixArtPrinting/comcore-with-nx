import { Test, TestingModule } from '@nestjs/testing';
import { AwskitService } from './awskit.service';

describe('AwskitService', () => {
  let service: AwskitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwskitService],
    }).compile();

    service = module.get<AwskitService>(AwskitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
