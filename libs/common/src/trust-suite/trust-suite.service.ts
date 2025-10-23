import { Inject, Injectable } from '@nestjs/common';
import { CimpressAuthClient } from '@app/clientskit';

interface TrustSuiteConfig {
  baseUrl: string;
  principalPermissionsEndpoint: string;
}

@Injectable()
export class TrustSuiteService {
  constructor(
    private readonly authClient: CimpressAuthClient,
    @Inject('TRUST_SUITE_CONFIG')
    private readonly trustSuiteConfig: TrustSuiteConfig,
  ) {}

  async getUserPermissions(
    canonicalId: string,
    resourceType: string,
    resourceIdentifier: string,
  ): Promise<string[]> {
    const baseUrl = this.trustSuiteConfig.baseUrl;
    const endpoint = this.trustSuiteConfig.principalPermissionsEndpoint
      .replace('_CLIENTADFS_', encodeURIComponent(canonicalId))
      .replace('_RESOURCETYPE_', resourceType)
      .replace('_RESOURCEIDENTIFIER_', resourceIdentifier);
    const url = `${baseUrl}${endpoint}`;
    const response = await this.authClient.request(
      url,
      null,
      'An error occurred while fetching the permissions',
      'get',
    );
    const res: { identifier: string; permissions: string[] } = response;
    return res.permissions;
  }

  async checkPermissions(
    canonicalId: string,
    resourceType: string,
    resourceIdentifier: string,
    permissions: string[],
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(
      canonicalId,
      resourceType,
      resourceIdentifier,
    );
    return permissions.every((p) => userPermissions.includes(p));
  }
}
