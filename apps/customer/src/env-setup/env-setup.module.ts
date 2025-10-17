import { Module } from '@nestjs/common';
import { EnvSetupCommand } from './env-setup.command';
import { EnvSetupServiceImpl } from './services/implementations/env-setup.service.impl';
import { ENV_SETUP_SERVICE } from './services/env-setup.service.interface';
import { SecretsManagerModule } from '@comcore/ocs-aws-kit';
import { EnvConfigModule } from '@comcore/ocs-lib-common';
import {ConfigModule} from "@nestjs/config";

/**
 * EnvSetupModule handles environment setup and configuration.
 * It imports necessary modules, provides services, and exports key functionalities.
 */
@Module({
  imports: [SecretsManagerModule, EnvConfigModule, ConfigModule],
  providers: [
    EnvSetupCommand,
    {
      useClass: EnvSetupServiceImpl,
      provide: ENV_SETUP_SERVICE,
    },
  ],
  exports: [EnvSetupCommand, ENV_SETUP_SERVICE],
})
export class EnvSetupModule {}
