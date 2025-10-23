import { Test, TestingModule } from '@nestjs/testing';
import { ClientskitService } from './clientskit.service';

describe('ClientskitService', () => {
  let service: ClientskitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientskitService],
    }).compile();

    service = module.get<ClientskitService>(ClientskitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
