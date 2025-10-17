import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { SnsModule } from './sns';
import { SecretsManagerModule } from './secrets-manager';

@Module({
  imports: [SnsModule, SecretsManagerModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
