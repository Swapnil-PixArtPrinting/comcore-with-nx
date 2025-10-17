import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheService } from '@comcore/ocs-lib-common';
import { CUSTOMER_GROUP_CACHE_PREFIX } from '../constants/customer-group.constants';
import { CustomerGroupRepositoryFactory } from '../providers/customer-group.repo.provider';

export const CUSTOMER_GROUP_FACADE = 'CUSTOMER_GROUP_FACADE';
@Injectable()
export class CustomerGroupFacade {
  constructor(
    @Inject(RedisCacheService)
    private readonly redisCacheService: RedisCacheService,
    private readonly customerGroupFactoryRepository: CustomerGroupRepositoryFactory,
  ) {}

  async fetchGroupUsingKey(customerGroupKey: string) {
    let customerGroup = await this.redisCacheService.get(
      CUSTOMER_GROUP_CACHE_PREFIX + '_' + customerGroupKey,
    );
    if (customerGroup) {
      return customerGroup;
    }

    customerGroup =
      await this.customerGroupFactoryRepository.repository.fetchGroupUsingKey(
        customerGroupKey,
      );
    await this.redisCacheService.set(
      CUSTOMER_GROUP_CACHE_PREFIX + '_' + customerGroupKey,
      customerGroup,
      1000 * 60 * 5,
    );
    return customerGroup;
  }
}
