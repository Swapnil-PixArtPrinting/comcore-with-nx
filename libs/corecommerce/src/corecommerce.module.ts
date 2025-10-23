import { Module } from '@nestjs/common';
import { CorecommerceService } from './corecommerce.service';
import { CoreConfigModule } from './config/core-config.module';
import { ClientModule } from './client/client.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [CoreConfigModule, ClientModule, RequestsModule],
  providers: [CorecommerceService],
  exports: [CorecommerceService],
})
export class CoreCommerceModule {}
