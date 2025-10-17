import { Injectable } from '@nestjs/common';
import {
  CommerceCustomerServiceFactory,
  CoreRegisterCustomerDTO,
  CustomerGroupModel,
  CustomerModel,
} from '@comcore/ocs-lib-corecommerce';
import { CustomerUpdateAction } from '@commercetools/platform-sdk';

@Injectable()
export class CustomerRestRepository {
  /**
   * Constructor
   * @param commerceCustomerService
   */
  constructor(
    private readonly commerceCustomerService: CommerceCustomerServiceFactory,
  ) {}

  async fetchCustomerById(customerId: string): Promise<CustomerModel> {
    return await this.commerceCustomerService.service.fetchCustomerById(
      customerId,
    );
  }

  /**
   * Set custom field
   * @param customer
   * @param fieldName
   * @param fieldValue
   * @param execute
   */
  async setCustomField(
    customer: CustomerModel,
    fieldName: string,
    fieldValue: unknown,
    execute?: boolean,
  ) {
    return await this.commerceCustomerService.service.setCustomField(
      customer,
      fieldName,
      fieldValue,
      execute,
    );
  }
  /**
   * Fetch customer by email
   * @param customerEmail
   */
  async fetchCustomerByEmail(customerEmail: string): Promise<CustomerModel> {
    return await this.commerceCustomerService.service.fetchCustomerByEmail(
      customerEmail,
    );
  }

  /**
   * Set Password
   * @param email
   * @param password
   */
  async setPassword(email: string, password: string) {
    return await this.commerceCustomerService.service.setPassword(
      email,
      password,
    );
  }

  /**
   * Change group of customer
   * @param customer
   * @param customerGroup
   * @param execute
   * @returns
   */
  async changeGroup(
    customer: CustomerModel,
    customerGroup?: CustomerGroupModel,
    execute: boolean = true,
  ) {
    return await this.commerceCustomerService.service.changeGroup(
      customer,
      customerGroup,
      execute,
    );
  }

  /**
   * Create customer from teh draft provided
   * @param customerDraft
   */
  async createCustomerFromDraft(customerDraft: CoreRegisterCustomerDTO) {
    return await this.commerceCustomerService.service.createCustomerFromDraft(
      customerDraft,
    );
  }

  /**
   * Add store
   * @param customer
   * @param storeKey
   * @param execute
   */
  async addStore(
    customer: CustomerModel,
    storeKey: string,
    execute: boolean = true,
  ) {
    return await this.commerceCustomerService.service.addStore(
      customer,
      storeKey,
      execute,
    );
  }

  /**
   * Change company name
   * @param customer
   * @param companyName
   * @param execute
   */
  async changeCompanyName(
    customer: CustomerModel,
    companyName: string,
    execute: boolean = true,
  ) {
    return await this.commerceCustomerService.service.changeCompanyName(
      customer,
      companyName,
      execute,
    );
  }

  /**
   * Change vat id
   * @param customer
   * @param vatId
   * @param execute
   */
  async changeVatId(
    customer: CustomerModel,
    vatId: string,
    execute: boolean = true,
  ) {
    return await this.commerceCustomerService.service.changeVatId(
      customer,
      vatId,
      execute,
    );
  }

  /**
   * Update customer with all actions
   * @param customer
   * @param actions
   * @param execute
   */
  async updateCustomerWithAllActions(
    customer: CustomerModel,
    actions: CustomerUpdateAction[],
    execute: boolean = true,
  ) {
    if (execute) {
      return await this.commerceCustomerService.service.updateAllCustomerActions(
        customer,
        actions,
      );
    } else {
      return actions;
    }
  }

  /**
   * Get customer reference
   * @param customerId
   */
  async getCustomerReference(customerId: string): Promise<JSON> {
    return await this.commerceCustomerService.service.getCustomerReference(
      customerId,
    );
  }

  async setKey(
    childCustomer: CustomerModel,
    key: string,
    execute: boolean = true,
  ) {
    return await this.commerceCustomerService.service.setKey(
      childCustomer,
      key,
      execute,
    );
  }

  async changeEmail(
    customer: CustomerModel,
    newEmail: string,
    execute: boolean = true,
  ) {
    return await this.commerceCustomerService.service.changeEmail(
      customer,
      newEmail,
      execute,
    );
  }
}
