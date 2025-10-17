import { Module } from '@nestjs/common';
import { CorecommerceService } from './corecommerce.service';

@Module({
  providers: [CorecommerceService],
  exports: [CorecommerceService],
})
export class CorecommerceModule {}
