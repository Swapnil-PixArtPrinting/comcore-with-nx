import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { EnvSetupCommand } from '../env-setup/env-setup.command';
import { SecretsManagerModule } from '@comcore/ocs-aws-kit';
import { EnvSetupModule } from '../env-setup/env-setup.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CommandModule,
    EnvSetupModule,
    SecretsManagerModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [EnvSetupCommand],
})
export class CommandAppModule {}
