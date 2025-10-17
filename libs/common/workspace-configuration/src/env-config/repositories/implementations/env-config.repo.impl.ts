import { Injectable } from '@nestjs/common';
import { IEnvConfigRepoInterface } from '../env-config.repo.interface';
import { ENV_CONFIG_DATA } from '../data/env-config.data';
import { ENV_VARIABLES } from '../data/env-variables.data';
import { DefaultConfig } from '../../../tenant-config/interfaces/tenantConfig.interface';

@Injectable()
export class EnvRepoImpl implements IEnvConfigRepoInterface {
  /**
   *
   * @param resource
   */
  async fetchEnvDetails(resource: string): Promise<DefaultConfig> {
    return ENV_CONFIG_DATA?.[resource] ?? null;
  }

  /**
   *
   * @param environment
   */
  async fetchEnvVariables(environment: string) {
    return ENV_VARIABLES?.[environment] ?? null;
  }
}
