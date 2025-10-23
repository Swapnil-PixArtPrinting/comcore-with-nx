// libs/corecommerce/src/requests/customer/core-customer.module.ts
import { Module } from '@nestjs/common';
import { CoreConfigModule } from '../../config';
import {
  COMMERCE_CUSTOMER_SERVICE,
  CommerceCustomerRepositoryFactory,
  CommerceCustomerServiceFactory,
  CommerceCustomerServiceImpl,
} from '../../requests';
import { CommercetoolRepository } from '../../requests/customer/repositories/api/customer.commercetool.repo';

@Module({
  imports: [CoreConfigModule],
  providers: [
    CommerceCustomerServiceFactory,
    CommerceCustomerServiceImpl,
    CommercetoolRepository,
    CommerceCustomerRepositoryFactory,
  ],
  exports: [CommerceCustomerServiceFactory],
})
export class CoreCustomerModule {}
