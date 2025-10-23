import { Inject, Injectable } from '@nestjs/common';
import {
  ENV_CONFIG_REPO,
  IEnvConfigRepoInterface,
} from '../../repositories/env-config.repo.interface';
import { IEnvConfigService } from '../env-config.service.interface';
import { DefaultConfig } from '../../../../../workspace-configuration/src/tenant-config/interfaces/tenantConfig.interface';

@Injectable()
export class EnvConfigServiceImpl implements IEnvConfigService {
  constructor(
    @Inject(ENV_CONFIG_REPO)
    private readonly envConfigService: IEnvConfigRepoInterface,
  ) {}
  /**
   *
   * @param resource
   */
  async fetchEnvDetails(resource: string): Promise<DefaultConfig> {
    return await this.envConfigService.fetchEnvDetails(resource);
  }

  /**
   *
   * @param environment
   */
  async fetchEnvVariables(environment: string) {
    return await this.envConfigService.fetchEnvVariables(environment);
  }
}
