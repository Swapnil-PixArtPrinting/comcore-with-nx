import { Injectable } from '@nestjs/common';
import { CommerceCustomerGroupService } from '../core-customer-group.service';
import { CustomerGroupModel } from '../../models';
import { CommerceCustomerGroupRepositoryFactory } from '../../providers';

@Injectable()
export class CommerceCustomerGroupServiceImpl implements CommerceCustomerGroupService {
    constructor(
      private readonly commerceCustomerGroupRepository: CommerceCustomerGroupRepositoryFactory
    ){
    }
    
    async fetchCustomerGroupByKey(customerGroupKey: string): Promise<CustomerGroupModel | null> {
        return await this.commerceCustomerGroupRepository.repository.fetchCustomerGroupByKey(customerGroupKey);
    }
}