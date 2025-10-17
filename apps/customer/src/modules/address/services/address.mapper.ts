import {
  ADDRESS_CUSTOM_FIELDS,
  ADDRESS_CUSTOM_FIELDS_TYPE_ID,
  ADDRESS_STANDARD_FIELDS,
  filterableFields,
  INVOICE_CYCLE_PERIOD_ELIGIBLE_CASES,
  REMOVABLE_ADDRESS_CUSTOM_FIELDS,
} from '../address.enum';
import { AddressModel, CustomerModel } from '@comcore/ocs-lib-corecommerce';
import { AddressType } from '../address.types';
import { CustomerProviderRepository } from '../../customer/repositories/customer-provider.repository';
import {
  Addresses,
  AddressStructure,
} from 'src/modules/customer/enums/customer.types';

export class AddressMapper {
  constructor(
    private readonly customerProviderRepository: CustomerProviderRepository,
  ) {}

  /**
   *
   * @param address
   * @param formCustomFields
   */
  toArray(
    address: AddressModel,
    formCustomFields: boolean = false,
  ): Record<string, unknown> {
    if (formCustomFields) {
      return this.transformToCustomFields(address);
    }
    return this.transformFromCustomFields(address);
  }

  /**
   *
   * @param customer
   * @param filter
   * @param includeInheritanceDetails
   */
  getAddressesArray(
    customer: CustomerModel,
    filter?: string[],
    includeInheritanceDetails?: boolean,
  ) {
    const data = {};
    data['billing'] = {};
    if (
      !filter ||
      !filter['additionalAddressInfo'] ||
      filter['additionalAddressInfo'].toLowerCase() === 'billing'
    ) {
      for (const address of Object.values(
        this.getAddresses(customer, 'billing'),
      )) {
        const addressArray = this.toArray(address);
        const isDefault = customer.defaultBillingAddressId === address.id;
        if (includeInheritanceDetails) {
          addressArray['inheritedFrom'] = customer.id;
          addressArray['inheritedDefault'] = isDefault;
        }
        delete addressArray[ADDRESS_STANDARD_FIELDS.additionalAddressInfo];
        data['billing'][address.id] = { ...addressArray };
        if (isDefault) {
          data['billing'][address.id]['isDefault'] = isDefault;
        }
      }
      this.filterAddresses(data, 'billing', filter);
    }

    data['shipping'] = {};
    if (
      !filter ||
      !filter['additionalAddressInfo'] ||
      filter['additionalAddressInfo']?.toLowerCase() === 'shipping'
    ) {
      for (const address of Object.values(
        this.getAddresses(customer, 'shipping'),
      )) {
        const addressArray = this.toArray(address);
        const isDefault = customer.defaultShippingAddressId === address.id;
        if (includeInheritanceDetails) {
          addressArray['inheritedFrom'] = customer.id;
          addressArray['inheritedDefault'] = isDefault;
        }
        delete addressArray[ADDRESS_STANDARD_FIELDS.additionalAddressInfo];
        data['shipping'][address.id] = { ...addressArray };
        if (isDefault) {
          data['shipping'][address.id]['isDefault'] = isDefault;
        }
      }
      this.filterAddresses(data, 'shipping', filter);
    }

    // remove expansions, as they are not actually a 'filter'
    if (filter) {
      delete filter['expansions'];
    }

    // Include defaults, only if the addresses are not being inherited & there are no filters
    if (!includeInheritanceDetails && !filter) {
      data['defaultBillingAddressId'] = customer.defaultBillingAddressId;
      data['defaultShippingAddressId'] = customer.defaultShippingAddressId;
    }

    return data as Addresses;
  }

  /**
   *
   * @param customer
   * @param type
   */
  getDefaultAddress(customer: CustomerModel, type: AddressType) {
    const defaultId =
      type === 'billing'
        ? customer.defaultBillingAddressId
        : customer.defaultShippingAddressId;

    if (!defaultId) {
      return undefined;
    }

    return customer.addresses?.find((address) => address.id === defaultId);
  }

  /**
   *
   * @param customer
   * @param type
   */
  getAddresses(
    customer: CustomerModel,
    type?: AddressType,
  ): Record<string, AddressModel> {
    const addressMap = Object.fromEntries(
      (customer.addresses ?? []).map((address) => [
        address.id,
        address as AddressModel,
      ]),
    );

    if (!type) {
      return addressMap;
    }

    const ids =
      type === 'billing'
        ? customer.billingAddressIds
        : customer.shippingAddressIds;
    return ids.reduce((acc, id) => {
      const address = addressMap[id] as AddressModel | undefined;
      if (address) {
        acc[id] = address;
      }
      return acc;
    }, {});
  }

  async getAddressesWithInheritance(
    customer: CustomerModel,
    filter: string[] = [],
  ) {
    const data = this.getAddressesArray(customer);

    const parentAddresses = {
      billing: [],
    };

    const childAddresses = {
      shipping: [],
    };

    // this array stores the list of customer ids which were not found in the system while inheriting the addresses
    // ex: customerReference of a customer points to a customer id which doesn't exist
    const missingCustomers: string[] = [];

    // Only if the additionalAddressInfo filter is not set or set to billing, we perform upward recursion
    if (
      !filter['additionalAddressInfo'] ||
      filter['additionalAddressInfo'] === 'billing'
    ) {
      const upwardFilter = { ...filter, ['additionalAddressInfo']: 'billing' };
      await this.upwardTraverser(
        customer,
        customer.id,
        parentAddresses,
        missingCustomers,
        upwardFilter,
      );
    }

    // Only if the additionalAddressInfo filter is not set or set to shipping, we perform downward recursion
    if (
      !filter['additionalAddressInfo'] ||
      filter['additionalAddressInfo'] === 'shipping'
    ) {
      const downwardFilter = {
        ...filter,
        ['additionalAddressInfo']: 'shipping',
      };
      await this.downwardTraverser(
        customer,
        customer.id,
        childAddresses,
        missingCustomers,
        downwardFilter,
      );
    }

    if (missingCustomers.length > 0) {
      console.log(missingCustomers);
    }

    return {
      billing: {
        ...(parentAddresses.billing || {}),
        ...(data.billing || {}),
      },
      shipping: {
        ...(childAddresses.shipping || {}),
        ...(data.shipping || {}),
      },
    } as Partial<Addresses>;
  }

  private async upwardTraverser(
    customer: CustomerModel,
    initiatedById: string,
    result: Record<string, any>,
    missingCustomers: string[],
    filter: string[] = [],
  ): Promise<void> {
    if (customer.id !== initiatedById) {
      this.mergeCustomerAddresses(customer, result, filter);
    }

    const fields = customer.custom?.fields;

    // get the parent customer and call this recursion function again
    if (fields.hasField('customerReference')) {
      const parentId = fields?.['customerReference'];
      try {
        const parentCustomer =
          await this.customerProviderRepository.repository.fetchCustomerById(
            parentId,
          );
        await this.upwardTraverser(
          parentCustomer,
          initiatedById,
          result,
          missingCustomers,
          filter,
        );
      } catch {
        missingCustomers.push(parentId);
      }
    }
  }

  private async downwardTraverser(
    customer: CustomerModel,
    initiatedById: string,
    result: Record<string, any>,
    missingCustomers: string[],
    filter: string[] = [],
  ): Promise<void> {
    if (customer.id !== initiatedById) {
      this.mergeCustomerAddresses(customer, result, filter);
    }

    const fields = customer.custom?.fields;

    // loop through all the child customers and call this recursion function again
    if (fields.hasField('customerReference')) {
      const customerRefs = fields.getFieldAsReferenceSet('customersReference');
      for (const reference of customerRefs) {
        try {
          const childCustomer =
            await this.customerProviderRepository.repository.fetchCustomerById(
              reference.id,
            );
          await this.downwardTraverser(
            childCustomer,
            initiatedById,
            result,
            missingCustomers,
            filter,
          );
        } catch {
          missingCustomers.push(reference.getId());
        }
      }
    }
  }

  /**
   *
   * @param customer
   * @param result
   * @param filter
   */
  // Fetch the customer's addresses, merge them with the result array
  private mergeCustomerAddresses(
    customer: CustomerModel,
    result: Record<string, any>,
    filter: string[] = [],
  ) {
    const addresses = this.getAddressesArray(customer, filter, true);
    for (const type of ['billing', 'shipping']) {
      if (addresses[type]) {
        result[type] = result[type] || {};
        for (const address of addresses[type]) {
          result[type][address.id] = address;
        }
      }
    }
  }

  /**
   *
   * @param data
   * @param addressType
   * @param filter
   */
  filterAddresses(
    data: Record<string, any>,
    addressType: string,
    filter: string[],
  ): Record<string, any> {
    if (filter && data && addressType) {
      for (const [addressId, address] of Object.entries(
        data[addressType] || {},
      )) {
        for (const [filterKey, filterValueRaw] of Object.entries(filter)) {
          if (!filterableFields.includes(filterKey)) {
            continue;
          }

          const filterValue = decodeURIComponent(filterValueRaw);
          const addressValue = address[filterKey];

          if (addressValue !== undefined) {
            const valueType = typeof addressValue;

            if (valueType === 'boolean') {
              const parsedBool = filterValue === 'true';
              if (addressValue === parsedBool) {
                continue;
              }
            } else if (Array.isArray(addressValue)) {
              try {
                const parsedArray = JSON.parse(filterValue);
                if (Array.isArray(parsedArray)) {
                  const sortedAddressValue = [...addressValue].sort();
                  const sortedFilterValue = [...parsedArray].sort();
                  if (
                    JSON.stringify(sortedAddressValue) ===
                    JSON.stringify(sortedFilterValue)
                  )
                    continue;
                }
              } catch {
                // Invalid JSON, treat as non-match
              }
            } else if (
              typeof addressValue === 'string' &&
              addressValue.toLowerCase() === filterValue.toLowerCase()
            ) {
              continue;
            }
          }

          // If no match, remove the address
          delete data[addressType][addressId];
          break; // No need to check other filters
        }
      }
    }

    return data;
  }

  /**
   *
   * @param address
   */
  hasCustomFields(address: AddressModel): boolean {
    return !!address.custom;
  }

  /**
   *
   * @param address
   * @param onlyCustomFields
   */
  transformToCustomFields(
    address: AddressModel,
    onlyCustomFields: boolean = false,
  ): Record<string, any> {
    const customFields: Record<string, any> = { fields: {} };
    const validCustomFields: string[] = Object.values(ADDRESS_CUSTOM_FIELDS);

    for (const [key, value] of Object.entries(address)) {
      if (!validCustomFields.includes(key)) {
        continue;
      }

      if (
        key === ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_AMOUNT ||
        key === ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_CURRENCY
      ) {
        customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT] =
          customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT] || {};

        if (value == null) {
          // Unset the entire creditLimit if either component is null
          delete customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT];
        } else {
          if (key === ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_AMOUNT) {
            customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT][
              'centAmount'
            ] = value;
          }
          if (key === ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_CURRENCY) {
            customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT][
              'currencyCode'
            ] = value;
          }
        }
      } else if (
        key === ADDRESS_CUSTOM_FIELDS.CF_IS_COMPANY &&
        value !== undefined
      ) {
        customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_IS_COMPANY] =
          String(value).toLowerCase() === 'true';
      } else if (key === ADDRESS_CUSTOM_FIELDS.CF_TAX_IDS) {
        customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_TAX_IDS] =
          JSON.stringify(value);
      } else if (key === ADDRESS_CUSTOM_FIELDS.CF_EXEMPTION_CATEGORIES) {
        customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_EXEMPTION_CATEGORIES] = (
          value as Record<string, unknown>[]
        )?.map((item) => JSON.stringify(item));
      } else if (key === ADDRESS_CUSTOM_FIELDS.CF_CREDIT_DAYS) {
        if (typeof value === 'string') {
          customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_DAYS] = parseInt(
            value,
            10,
          );
        }
      } else if (
        key === ADDRESS_CUSTOM_FIELDS.CF_INVOICE_CYCLE &&
        value === 'perBillingProfile' &&
        !address[ADDRESS_CUSTOM_FIELDS.CF_INVOICE_CYCLE_PERIOD] &&
        !customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_INVOICE_CYCLE_PERIOD]
      ) {
        customFields.fields[ADDRESS_CUSTOM_FIELDS.CF_INVOICE_CYCLE_PERIOD] =
          INVOICE_CYCLE_PERIOD_ELIGIBLE_CASES['monthly'];
        customFields.fields[key] = value;
      } else if (
        !(
          REMOVABLE_ADDRESS_CUSTOM_FIELDS.includes(key) &&
          (value === null || value === undefined || value === '')
        )
      ) {
        customFields.fields[key] = value;
      }

      delete address[key];
    }

    if (Object.keys(customFields.fields).length > 0) {
      address['custom'] = {
        fields: customFields,
        type: {
          typeId: 'type',
          id: ADDRESS_CUSTOM_FIELDS_TYPE_ID,
        },
      };
    }

    return onlyCustomFields ? customFields.fields : address;
  }

  /**
   *
   * @param address
   */
  transformFromCustomFields(address: AddressModel): Record<string, any> {
    const validCustomFields = Object.values(ADDRESS_CUSTOM_FIELDS);

    if (this.hasCustomFields(address)) {
      const fields = address?.custom?.fields ?? {};

      for (const [fieldName, fieldValue] of Object.entries(fields)) {
        if (!validCustomFields.includes(fieldName)) {
          continue;
        }

        if (fieldName === ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT) {
          address[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_CURRENCY] =
            fieldValue?.['currencyCode'];
          address[ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_AMOUNT] =
            fieldValue?.['centAmount'];
        } else if (fieldName === ADDRESS_CUSTOM_FIELDS.CF_TAX_IDS) {
          try {
            if (typeof fieldValue === 'string') {
              address[ADDRESS_CUSTOM_FIELDS.CF_TAX_IDS] =
                JSON.parse(fieldValue);
            }
          } catch {
            address[ADDRESS_CUSTOM_FIELDS.CF_TAX_IDS] = [];
          }
        } else if (
          fieldName === ADDRESS_CUSTOM_FIELDS.CF_EXEMPTION_CATEGORIES
        ) {
          const exemptionCategories: unknown[] = [];
          if (Array.isArray(fieldValue)) {
            for (const json of fieldValue) {
              try {
                exemptionCategories.push(JSON.parse(json));
              } catch {
                // handle or ignore invalid JSON
              }
            }
          }
          address[ADDRESS_CUSTOM_FIELDS.CF_EXEMPTION_CATEGORIES] =
            exemptionCategories;
        } else {
          address[fieldName] = fieldValue;
        }
      }

      delete address.custom;
    }
    return address;
  }
}
