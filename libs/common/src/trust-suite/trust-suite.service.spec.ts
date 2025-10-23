import { Test, TestingModule } from '@nestjs/testing';
import { TrustSuiteService } from './trust-suite.service';
import { CimpressAuthClient } from '@app/clientskit';

describe('TrustSuiteService', () => {
  let service: TrustSuiteService;
  const mockAuthClient = { request: jest.fn() };
  const mockConfig = {
    baseUrl: 'https://fake-base-url.com',
    principalPermissionsEndpoint:
      '/principals/_CLIENTADFS_/permissions/_RESOURCETYPE_/_RESOURCEIDENTIFIER_/',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustSuiteService,
        { provide: CimpressAuthClient, useValue: mockAuthClient },
        { provide: 'TRUST_SUITE_CONFIG', useValue: mockConfig },
      ],
    }).compile();

    service = module.get<TrustSuiteService>(TrustSuiteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return permissions from getUserPermissions', async () => {
    const fakeResponse = {
      identifier: 'user123',
      permissions: ['read', 'write'],
    };
    mockAuthClient.request.mockResolvedValue(fakeResponse);

    const permissions = await service.getUserPermissions(
      'user123',
      'document',
      'doc1',
    );

    expect(mockAuthClient.request).toHaveBeenCalledWith(
      'https://fake-base-url.com/principals/user123/permissions/document/doc1/',
      null,
      'An error occurred while fetching the permissions',
      'get',
    );

    expect(permissions).toEqual(['read', 'write']);
  });

  it('should correctly check permissions in checkPermissions', async () => {
    mockAuthClient.request.mockResolvedValue({
      identifier: 'user123',
      permissions: ['read', 'write'],
    });

    const hasPermissions = await service.checkPermissions(
      'user123',
      'document',
      'doc1',
      ['read'],
    );
    expect(hasPermissions).toBe(true);

    const missingPermissions = await service.checkPermissions(
      'user123',
      'document',
      'doc1',
      ['read', 'delete'],
    );
    expect(missingPermissions).toBe(false);
  });
});
