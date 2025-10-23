import { Module } from '@nestjs/common';
import { SnsConfigService } from './config/sns.config';
import { SnsClientBuilder } from './client/sns.client';
import { SNS_SERVICE, SnsServiceImpl } from './services';

@Module({
  imports: [],
  providers: [
    SnsConfigService,
    SnsClientBuilder,
    {
      useClass: SnsServiceImpl,
      provide: SNS_SERVICE,
    },
  ],
  exports: [SnsConfigService, SnsClientBuilder, SNS_SERVICE],
})
export class SnsModule {}
