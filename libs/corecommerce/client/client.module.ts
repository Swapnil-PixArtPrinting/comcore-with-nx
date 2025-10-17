import { Module } from '@nestjs/common';
import { CoreCommerceClientBuilder } from './client.builder';
import { LoggerModule } from '../../../common/src';

@Module({
  imports: [LoggerModule],
  providers: [CoreCommerceClientBuilder],
  exports: [CoreCommerceClientBuilder],
})
export class ClientModule {}
