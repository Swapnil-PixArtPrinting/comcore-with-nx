import { Module } from '@nestjs/common';
import { RequestClientModule } from './request-client';

@Module({
  imports: [RequestClientModule],
  providers: [],
  exports: [],
})
export class ClientskitModule {}
