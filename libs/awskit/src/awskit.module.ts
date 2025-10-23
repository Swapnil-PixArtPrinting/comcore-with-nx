import { Module } from '@nestjs/common';
import { AwskitService } from './awskit.service';
import { SnsModule } from './sns';
import { SecretsManagerModule } from './secrets-manager';

@Module({
  imports: [SnsModule, SecretsManagerModule],
  providers: [AwskitService],
  exports: [AwskitService],
})
export class AwskitModule {}
