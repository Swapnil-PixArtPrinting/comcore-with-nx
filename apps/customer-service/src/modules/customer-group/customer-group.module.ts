import { Module } from '@nestjs/common';
import { CustomerGroupGraphqlRepository } from './repositories/request/customer-group.graphql.repo';
import { CustomerGroupRestRepository } from './repositories/request/customer-group.rest.repo';
import { CustomerGroupRepositoryFactory } from './providers/customer-group.repo.provider';
import { CustomerGroupService } from './services/customer-group.service';
import { CoreCustomerGroupModule } from '@app/corecommerce';
import { ApiTypeService } from '../../apiType/api.type';
import { CustomerGroupFacade } from './services/customer-group.facade';
import { RedisCacheModule } from '@app/common';

@Module({
  imports: [CoreCustomerGroupModule, RedisCacheModule],
  providers: [
    ApiTypeService,
    CustomerGroupGraphqlRepository,
    CustomerGroupRestRepository,
    CustomerGroupRepositoryFactory,
    CustomerGroupFacade,
    CustomerGroupService,
  ],
  exports: [
    CustomerGroupService,
    CustomerGroupRepositoryFactory,
    CustomerGroupFacade,
  ],
})
export class CustomerGroupModule {}
