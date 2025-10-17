import { CoreConfigModule } from '../../config';
import { Module } from '@nestjs/common';
import { CommercetoolCustomerGroupRepository } from './repositories/api/core-customer-group.commercetool.repo';
import { CommerceCustomerGroupRepositoryFactory } from './providers/core-customer-group.repo.factory';
import { CommerceCustomerGroupServiceImpl } from './services';
import {
    CommerceCustomerGroupServiceFactory
} from './providers/core-customer-group.service.factory';

@Module({
    imports: [
      CoreConfigModule
    ],
    providers: [
        CommercetoolCustomerGroupRepository,
        CommerceCustomerGroupRepositoryFactory,
        CommerceCustomerGroupServiceFactory,
        CommerceCustomerGroupServiceImpl,
    ],
    exports: [CommerceCustomerGroupServiceFactory, CommerceCustomerGroupRepositoryFactory]
})
export class CoreCustomerGroupModule {}