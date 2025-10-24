import { Injectable } from '@nestjs/common';
import { AddressModel, CustomerModel } from '@app/corecommerce';
import { AddressMapper } from './address.mapper';
import { ADDRESS_TYPES } from '../address.enum';
import { AddressType } from '../address.types';

@Injectable()
export class AddressService {
  constructor(private readonly addressMapper: AddressMapper) {}

  /**
   * Get all addresses for a customer
   * @param customer
   * @param filter
   * @param includeInheritanceDetails
   */
  getCustomerAddresses(
    customer: CustomerModel,
    filter?: string[],
    includeInheritanceDetails?: boolean,
  ) {
    return this.addressMapper.getAddressesArray(
      customer,
      filter,
      includeInheritanceDetails,
    );
  }

  /**
   * Get addresses of a specific type for a customer
   * @param customer
   * @param type
   */
  getAddressesByType(customer: CustomerModel, type: AddressType) {
    return this.addressMapper.getAddresses(customer, type);
  }

  /**
   * Get default address for a customer
   * @param customer
   * @param type
   */
  getDefaultAddress(customer: CustomerModel, type: AddressType) {
    return this.addressMapper.getDefaultAddress(customer, type);
  }

  /**
   * Convert address model to array format
   * @param address
   * @param formCustomFields
   */
  convertAddressToArray(
    address: AddressModel,
    formCustomFields: boolean = false,
  ) {
    return this.addressMapper.toArray(address, formCustomFields);
  }

  /**
   * Get billing addresses for a customer
   * @param customer
   */
  getBillingAddresses(customer: CustomerModel) {
    return this.getAddressesByType(customer, ADDRESS_TYPES.BILLING);
  }

  /**
   * Get shipping addresses for a customer
   * @param customer
   */
  getShippingAddresses(customer: CustomerModel) {
    return this.getAddressesByType(customer, ADDRESS_TYPES.SHIPPING);
  }

  /**
   * Get default billing address for a customer
   * @param customer
   */
  getDefaultBillingAddress(customer: CustomerModel) {
    return this.getDefaultAddress(customer, ADDRESS_TYPES.BILLING);
  }

  /**
   * Get default shipping address for a customer
   * @param customer
   */
  getDefaultShippingAddress(customer: CustomerModel) {
    return this.getDefaultAddress(customer, ADDRESS_TYPES.SHIPPING);
  }

  /**
   * Get addresses with inheritance for a customer
   * @param customer
   * @param filter
   */
  async getAddressesWithInheritance(
    customer: CustomerModel,
    filter: string[] = [],
  ) {
    return this.addressMapper.getAddressesWithInheritance(customer, filter);
  }
}
