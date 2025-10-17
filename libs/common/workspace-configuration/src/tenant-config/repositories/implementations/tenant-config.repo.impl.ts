import { Injectable } from '@nestjs/common';
import { ITenantConfigRepo } from '../tenant-config.repo.interface';
import { TENANTCONFIGDATA } from '../data/config.data';
import { CIMPRESS_JWT_AUTH } from '../data/cimpress-jwt-auth.data';
import { DefaultConfig } from '../../../tenant-config/interfaces/tenantConfig.interface';

@Injectable()
export class TenantConfigRepoImpl implements ITenantConfigRepo {
  /**
   *
   * @param workspaceName
   * @param store
   * @param tenant
   */
  async fetchTenantDetails(
    workspaceName: string,
    store: string = 'default',
    tenant: string = 'default',
  ): Promise<DefaultConfig | null> {
    if (store === 'default' && tenant === 'default') {
      return TENANTCONFIGDATA?.[workspaceName]?.['default'] ?? null;
    }

    return TENANTCONFIGDATA?.[workspaceName]?.[store]?.[tenant] ?? null;
  }

  /**
   *
   */
  async getCimpressAuth() {
    return CIMPRESS_JWT_AUTH;
  }
}
