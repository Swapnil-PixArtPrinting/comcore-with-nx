import { Inject, Injectable } from '@nestjs/common';
import { CommerceCustomerGroupRepository } from '../core-customer-group.repo';
import { CoreClientService, CoreConfigService } from '../../../../config';
import { CustomerGroupModel } from '../../models';

@Injectable()
export class CommercetoolCustomerGroupRepository
  implements CommerceCustomerGroupRepository
{
  constructor(
    @Inject(CoreConfigService)
    private readonly coreConfigService: CoreConfigService,
    @Inject(CoreClientService)
    private readonly coreClientService: CoreClientService,
  ) {}

  /**
   *
   * @param customerGroupKey
   */
  async fetchCustomerGroupByKey(
    customerGroupKey: string,
  ): Promise<CustomerGroupModel | null> {
    const customeGroupDataCollection = await this.coreClientService
      .getClient()
      .customerGroups()
      .withKey({ key: customerGroupKey })
      .get()
      .execute();

    return customeGroupDataCollection.body &&
      Object.keys(customeGroupDataCollection.body).length > 0
      ? customeGroupDataCollection.body
      : null;
  }
}
