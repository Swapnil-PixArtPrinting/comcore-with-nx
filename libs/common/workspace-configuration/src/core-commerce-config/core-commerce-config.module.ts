import { Module } from '@nestjs/common';
import { CoreCommerceConfigService } from './core-commerce-config.service';

@Module({
  imports: [],
  providers: [CoreCommerceConfigService],
  exports: [CoreCommerceConfigService],
})
export class CoreCommerceConfigModule {}
