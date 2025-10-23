import { Injectable } from '@nestjs/common';
import { ICustomerGroupRepository } from '../customer-group.repositories.interface';
import {
  CustomerGroupModel,
  CommerceCustomerGroupServiceFactory,
} from '@app/corecommerce';

@Injectable()
export class CustomerGroupRestRepository implements ICustomerGroupRepository {
  constructor(
    private readonly commerceCustomerGroupService: CommerceCustomerGroupServiceFactory,
  ) {}

  /**
   *
   * @param customerGroupKey
   */
  async fetchGroupUsingKey(
    customerGroupKey: string,
  ): Promise<CustomerGroupModel | null> {
    return await this.commerceCustomerGroupService.service.fetchCustomerGroupByKey(
      customerGroupKey,
    );
  }
}
