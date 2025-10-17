import { Injectable } from '@nestjs/common';
import { ApiTypeService } from '../../../apiType/api.type';
import { ApiType } from '../../../shared/enums/api-type.enum';
import { CustomerRestRepository } from './customer-rest.repository';

@Injectable()
export class CustomerProviderRepository {
  constructor(
    private readonly apiTypeService: ApiTypeService,
    private readonly restRepo: CustomerRestRepository,
  ) {}

  get repository() {
    switch (this.apiTypeService.getApiType()) {
      case ApiType.GRAPHQL:
        return null; //TODO: We will implement GraphQL repository later
      case ApiType.REST:
        return this.restRepo;
      default:
        return this.restRepo;
    }
  }
}
