import { Inject } from '@nestjs/common';
import { ITenantConfigService } from '../tenant-config.service.interface';
import type { ITenantConfigRepo } from '../../repositories/tenant-config.repo.interface';
import { TENANT_CONFIG_REPO } from '../../repositories/tenant-config.repo.interface';
import { DefaultConfig } from '../../../tenant-config/interfaces/tenantConfig.interface';

export class TenantConfigServiceImpl implements ITenantConfigService {
  constructor(
    @Inject(TENANT_CONFIG_REPO)
    private readonly tenantConfigRepo: ITenantConfigRepo,
  ) {}
  async get(
    workspaceName: string,
    key: string,
    store: string,
    tenantId: string = 'default',
  ): Promise<string> {
    const formattedTenantId = tenantId.replace(/\./g, '_');
    const config = await this.getTenantConfig(
      workspaceName,
      store,
      formattedTenantId,
    );
    return (
      config[key] ??
      (() => {
        throw new Error(
          `Config 'tenant.${workspaceName}.${store}.${tenantId}.${key}' missing.`,
        );
      })()
    );
  }

  async getTenantConfig(
    workspaceName: string,
    store: string = 'default',
    tenantId: string = 'default',
  ): Promise<DefaultConfig> {
    // Step 1: Fetch tenant-level default config (e.g. tenant.xyz.default)
    let tenantDefaultConfig = await this.tenantConfigRepo.fetchTenantDetails(
      workspaceName,
      'default',
      'default',
    );
    if (!tenantDefaultConfig) tenantDefaultConfig = {};

    // Step 2: Fetch store-level default config (e.g. tenant.xyz.xyz.default)
    let storeDefaultConfig = await this.tenantConfigRepo.fetchTenantDetails(
      workspaceName,
      store,
      'default',
    );
    if (!storeDefaultConfig) storeDefaultConfig = {};

    // Step 3: Fetch store-level tenant-specific config (e.g. tenant.xyz.xyz.someTenantId)
    let storeTenantConfig = await this.tenantConfigRepo.fetchTenantDetails(
      workspaceName,
      store,
      tenantId,
    );
    if (!storeTenantConfig) storeTenantConfig = {};

    // Merge configs: most general → most specific
    const finalTenantConfig = {
      ...tenantDefaultConfig,
      ...storeDefaultConfig,
      ...storeTenantConfig,
    };

    if (Object.keys(finalTenantConfig).length === 0) {
      throw new Error(
        `Config 'tenant.${workspaceName}.${store}.${tenantId}' missing.`,
      );
    }

    return finalTenantConfig;
  }

  async getCimpressAuth() {
    return await this.tenantConfigRepo.getCimpressAuth();
  }
}
