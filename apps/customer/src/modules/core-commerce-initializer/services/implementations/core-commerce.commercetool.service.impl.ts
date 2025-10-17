import { Inject, Injectable } from '@nestjs/common';
import { ICoreCommerceInitializerService } from '../core-commerce-initialazer-service.interface';
import { CoreCommerceConfigService } from '@comcore/ocs-lib-common';
import { CoreConfigService } from '@comcore/ocs-lib-corecommerce';

/**
 * @description Service for Core Commerce Commercetool
 */
@Injectable()
export class CoreCommerceCommercetoolServiceImpl
  implements ICoreCommerceInitializerService
{
  /**
   * @description Constructor
   * @param coreCommerceConfigService
   * @param coreConfigService
   */
  constructor(
    @Inject(CoreCommerceConfigService)
    private readonly coreCommerceConfigService: CoreCommerceConfigService,
    @Inject(CoreConfigService)
    private readonly coreConfigService: CoreConfigService,
  ) {}

  private async resolveEnvVars(
    config: Record<string, any>,
  ): Promise<Record<string, any>> {
    const resolvedConfig: Record<string, any> = {};

    for (const key in config) {
      resolvedConfig[key] = {};
      for (const innerKey in config[key]) {
        resolvedConfig[key][innerKey] = {};
        for (const prop in config[key][innerKey]) {
          const envKey = config[key][innerKey][prop];
          resolvedConfig[key][innerKey][prop] = process.env[envKey] || null;
        }
      }
    }
    return resolvedConfig;
  }

  /**
   * @description Initialize Core Commerce
   */
  async initialize() {
    // Set Core Commerce Config
    let coreCommerceConfig =
      this.coreCommerceConfigService.getCoreCommerceConfig();
    coreCommerceConfig = await this.resolveEnvVars(coreCommerceConfig);
    await this.coreConfigService.setCoreCommerceConfig(coreCommerceConfig);
    await this.coreConfigService.setCoreCommerceClientInstance();
  }
}
