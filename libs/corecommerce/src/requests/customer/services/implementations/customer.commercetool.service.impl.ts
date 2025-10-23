import { Injectable } from '@nestjs/common';
import { CommerceCustomerService } from '../customer.service';
import { CustomerModel } from '../../models';
import {
  Customer,
  CustomerAddStoreAction,
  CustomerReference,
  CustomerSetCompanyNameAction,
  CustomerSetCustomTypeAction,
  CustomerSetKeyAction,
  CustomerSetVatIdAction,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { CustomerGroupModel } from '../../../core-customer-group';
import {
  CoreRegisterCustomerDTO,
  UpdateCustomerCustomField,
  UpdateCustomerGroupDto,
} from '../../dto';
import { CommerceCustomerRepositoryFactory } from '../../providers';

@Injectable()
export class CommerceCustomerServiceImpl implements CommerceCustomerService {
  constructor(
    private readonly commerceCustomerRepository: CommerceCustomerRepositoryFactory,
  ) {}

  /**
   *
   * @param customer
   * @param actions
   * @returns
   */
  async updateAllCustomerActions(
    customer: Customer,
    actions: Array<any>,
  ): Promise<CustomerModel | null> {
    return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
      customer,
      actions,
    );
  }

  /**
   *
   * @param customerEmail
   * @returns
   */
  async fetchCustomerByEmail(
    customerEmail: string,
  ): Promise<CustomerModel | null> {
    return await this.commerceCustomerRepository.repository.fetchCustomerByEmail(
      customerEmail,
    );
  }

  async fetchCustomerById(customerId: string): Promise<CustomerModel | null> {
    return await this.commerceCustomerRepository.repository.fetchCustomerById(
      customerId,
    );
  }

  /**
   *
   * @param email
   * @param password
   */
  async setPassword(email: string, password: string) {
    return await this.commerceCustomerRepository.repository.setPassword(
      email,
      password,
    );
  }

  /**
   *
   * @param customer
   * @param customerGroup
   * @param execute
   */
  async changeGroup(
    customer: CustomerModel,
    customerGroup?: CustomerGroupModel,
    execute?: boolean,
  ) {
    const customerGroupSetAction = new UpdateCustomerGroupDto();
    customerGroupSetAction.action = 'setCustomerGroup';
    if (customerGroup) {
      customerGroupSetAction.customerGroup = {
        typeId: 'customer-group',
        id: customerGroup.id,
      };
    } else {
      customerGroupSetAction.customerGroup = undefined;
    }

    if (execute) {
      return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
        customer,
        [customerGroupSetAction],
      );
    } else {
      return customerGroupSetAction;
    }
  }

  /**
   *
   * @param customer
   * @param fieldName
   * @param fieldValue
   * @param execute
   */
  async setCustomField(
    customer: CustomerModel,
    fieldName: string,
    fieldValue: any,
    execute?: boolean,
  ) {
    if (customer?.custom) {
      const customerCustomFieldSetAction = new UpdateCustomerCustomField();
      customerCustomFieldSetAction.action = 'setCustomField';
      customerCustomFieldSetAction.name = fieldName;
      if (fieldValue) customerCustomFieldSetAction.value = fieldValue;
      else customerCustomFieldSetAction.value = null;

      if (execute) {
        return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
          customer,
          [customerCustomFieldSetAction],
        );
      } else {
        return customerCustomFieldSetAction;
      }
    } else {
      const customerCustomTypeSetAction: CustomerSetCustomTypeAction = {
        action: 'setCustomType',
        fields: {
          fieldName: fieldValue,
        },
        type: {
          typeId: 'type',
          key: 'customerCustomFields',
        },
      };

      if (execute) {
        return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
          customer,
          [customerCustomTypeSetAction],
        );
      } else {
        return customerCustomTypeSetAction;
      }
    }
  }

  /**
   *
   * @param customerDraft
   */
  async createCustomerFromDraft(customerDraft: CoreRegisterCustomerDTO) {
    return await this.commerceCustomerRepository.repository.createCustomerFromDraft(
      customerDraft,
    );
  }

  /**
   *
   * @param customer
   */
  async addStore(
    customer: CustomerModel,
    storeKey: string,
    execute: boolean = true,
  ) {
    const customerAddStoreAction: CustomerAddStoreAction = {
      action: 'addStore',
      store: {
        typeId: 'store',
        key: storeKey,
      },
    };
    if (execute) {
      return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
        customer,
        [customerAddStoreAction],
      );
    } else {
      return customerAddStoreAction;
    }
  }

  /**
   *
   * @param customer
   * @param companyName
   * @param execute
   */
  async changeCompanyName(
    customer: CustomerModel,
    companyName?: string,
    execute?: boolean,
  ) {
    const customerSetCompanyNameAction: CustomerSetCompanyNameAction = {
      action: 'setCompanyName',
      companyName: companyName,
    };
    if (execute) {
      return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
        customer,
        [customerSetCompanyNameAction],
      );
    } else {
      return customerSetCompanyNameAction;
    }
  }

  /**
   *
   * @param customer
   * @param vatId
   * @param execute
   */
  async changeVatId(
    customer: CustomerModel,
    vatId?: string,
    execute?: boolean,
  ) {
    const customerSetVatIdAction: CustomerSetVatIdAction = {
      action: 'setVatId',
      vatId: vatId,
    };
    if (execute) {
      return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
        customer,
        [customerSetVatIdAction],
      );
    } else {
      return customerSetVatIdAction;
    }
  }

  getCustomerReference(customerId: string): CustomerReference {
    return {
      typeId: 'customer',
      id: customerId,
    };
  }

  async setKey(customer: CustomerModel, key: string, execute: boolean = true) {
    const customerSetKeyAction: CustomerSetKeyAction = {
      action: 'setKey',
      key: key,
    };

    if (execute) {
      return await this.commerceCustomerRepository.repository.updateAllCustomerActions(
        customer,
        [customerSetKeyAction],
      );
    } else {
      return customerSetKeyAction;
    }
  }

  /**
   *
   * Update or return action for changing customer email.
   *
   * @param customer
   * @param email
   * @param execute
   */
  async changeEmail(
    customer: CustomerModel,
    newEmail: string,
    execute: boolean = true,
  ) {
    const actions: CustomerUpdateAction[] = [];

    if (newEmail && newEmail !== customer.email) {
      actions.push({
        action: 'changeEmail',
        email: newEmail,
      });
    }

    if (actions.length === 0) return execute ? customer : actions;

    return execute
      ? await this.commerceCustomerRepository.repository.updateAllCustomerActions(
          customer,
          actions,
        )
      : actions;
  }
}
