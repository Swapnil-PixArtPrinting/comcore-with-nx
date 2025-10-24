import { Injectable, Provider } from '@nestjs/common';
import { ApiTypeService } from '../../../apiType/api.type';
import { CustomerGroupRestRepository } from '../repositories/request/customer-group.rest.repo';
import { CustomerGroupGraphqlRepository } from '../repositories/request/customer-group.graphql.repo';
import { ICustomerGroupRepository } from '../repositories/customer-group.repositories.interface';
import { ApiType } from '../../../shared/enums/api-type.enum';

@Injectable()
export class CustomerGroupRepositoryFactory {
  constructor(
    private readonly apiTypeService: ApiTypeService,
    private readonly graphqlRepo: CustomerGroupGraphqlRepository,
    private readonly restRepo: CustomerGroupRestRepository,
  ) {}

  get repository(): ICustomerGroupRepository {
    switch (this.apiTypeService.getApiType()) {
      case ApiType.GRAPHQL:
        return this.graphqlRepo;
      case ApiType.REST:
        return this.restRepo;
      default:
        return this.restRepo;
    }
  }
}
