import { Module } from '@nestjs/common';
import { EnvConfigServiceImpl } from './services/implementations/env-config.service.impl';
import { ENV_CONFIG_SERVICE } from './services/env-config.service.interface';
import { ENV_CONFIG_REPO } from './repositories/env-config.repo.interface';
import { EnvRepoImpl } from './repositories/implementations/env-config.repo.impl';

@Module({
  imports: [],
  providers: [
    {
      useClass: EnvConfigServiceImpl,
      provide: ENV_CONFIG_SERVICE,
    },
    {
      useClass: EnvRepoImpl,
      provide: ENV_CONFIG_REPO,
    },
  ],
  exports: [ENV_CONFIG_SERVICE, ENV_CONFIG_REPO],
})
export class EnvConfigModule {}
