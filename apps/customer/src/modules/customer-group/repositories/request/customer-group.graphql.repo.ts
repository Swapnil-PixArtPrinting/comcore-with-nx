import { Injectable } from '@nestjs/common';
import { ICustomerGroupRepository } from '../customer-group.repositories.interface';

@Injectable()
export class CustomerGroupGraphqlRepository implements ICustomerGroupRepository {
  /**
   *
   * @param string
   */
  async fetchGroupUsingKey(string: any) {}
}
