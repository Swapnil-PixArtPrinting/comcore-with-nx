import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheService } from '@comcore/ocs-lib-common';
import { CustomerProviderRepository } from '../repositories/customer-provider.repository';
import { CustomerModel } from '@comcore/ocs-lib-corecommerce';

export const CUSTOMER_FACADE = 'CUSTOMER_FACADE';
/**
 * ProfileFacadeImpl
 */
@Injectable()
export class CustomerFacade {
  /**
   * Constructor
   * @param redisCacheService
   * @param customerProviderRepository
   */
  constructor(
    @Inject(RedisCacheService)
    private readonly redisCacheService: RedisCacheService,
    private readonly customerProviderRepository: CustomerProviderRepository,
  ) {}

  /**
   * Put customer in cache using email
   * @param email
   * @param customer
   */
  async putCustomerInCacheByEmail(email: string, customer: CustomerModel) {
    await this.redisCacheService.set(email, customer, 1000 * 60 * 5);
  }

  /**
   * Fetch customer by cache using email
   * @param email
   * @param noCache
   */
  async fetchCustomerByEmail(email: string, noCache = false) {
    let customer: CustomerModel = await this.redisCacheService.get(email);
    if (!noCache && customer) {
      return customer;
    }

    customer =
      await this.customerProviderRepository.repository.fetchCustomerByEmail(
        email,
      );
    if (customer) {
      await this.putCustomerInCacheByEmail(email, customer);
      await this.putCustomerInCacheById(customer.id, customer);
    }
    return customer;
  }

  async putCustomerInCacheById(id: string, customer: CustomerModel) {
    await this.redisCacheService.set(id, customer, 1000 * 60 * 5);
  }

  async fetchCustomerById(id: string, noCache = false): Promise<CustomerModel> {
    let customer: CustomerModel = await this.redisCacheService.get(id);
    if (!noCache && customer) {
      return customer;
    }

    customer =
      await this.customerProviderRepository.repository.fetchCustomerById(id);
    await this.putCustomerInCacheById(id, customer);
    await this.putCustomerInCacheByEmail(customer.email, customer);
    return customer;
  }

  async clearCustomerCacheByEmail(email: string) {
    await this.redisCacheService.del(email);
  }

  async refreshCustomerCache(customer: CustomerModel, oldEmail: string) {
    await this.clearCustomerCacheByEmail(oldEmail);
    await this.putCustomerInCacheByEmail(customer.email, customer);
    await this.putCustomerInCacheById(customer.id, customer);
  }
}
