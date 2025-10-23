import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceConfigurationService } from './workspace-configuration.service';

describe('WorkspaceConfigurationService', () => {
  let service: WorkspaceConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceConfigurationService],
    }).compile();

    service = module.get<WorkspaceConfigurationService>(
      WorkspaceConfigurationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
