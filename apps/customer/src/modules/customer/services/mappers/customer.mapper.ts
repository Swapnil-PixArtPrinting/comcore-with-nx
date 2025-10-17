import { CustomerModel } from '@comcore/ocs-lib-corecommerce';
import { Inject, forwardRef } from '@nestjs/common';
import { ChannelRepositoryFactory } from '../../../channel/providers/channel.repo.provider';
import { CUSTOMER_SERVICE, CustomerService } from '../customer.service';
import { MlamService } from '../mlam.service';
import {
  CUSTOMER_CUSTOM_FIELDS_DATATYPE,
  CUSTOMER_EXPANDABLES,
  CUSTOMER_METADATA_FIELDS_READONLY,
  CUSTOMER_STANDARD_FIELDS,
  CUSTOMER_CUSTOM_FIELDS,
  CUSTOMER_METADATA_FIELDS,
} from '../../enums/common.enum';
import {
  Customer,
  NodeType,
  RegisteredFromStore,
  ResourceIdentity,
} from '../../enums/customer.types';
import { AddressService } from '../../../address/services/address.service';

export const CUSTOMER_MAPPER = 'CUSTOMER_MAPPER';

/**
 * Profile Mapper Implementation
 */
export class CustomerMapper {
  constructor(
    @Inject(forwardRef(() => CUSTOMER_SERVICE))
    private readonly customerService: CustomerService,
    private readonly channelFactoryRepository: ChannelRepositoryFactory,
    @Inject(AddressService)
    private readonly addressService: AddressService,
    @Inject(MlamService)
    private readonly mlamService: MlamService,
  ) {}

  /**
   * Convert Customer to appropriate format in Json
   * @param customer
   * @param expansions
   */
  async toArray(
    customerModel: CustomerModel,
    expansions: string[],
  ): Promise<Partial<Customer>> {
    // Convert all expansions to uppercase and trim
    expansions = expansions.map((item) => item.trim().toUpperCase());
    expansions = expansions.filter((item) =>
      Object.values(CUSTOMER_EXPANDABLES).includes(item),
    );

    // Call the toArrayLite method to get the basic customer setup
    const customer = await this.toArrayLite(customerModel, expansions);
    return customer;
  }

  async getExternalAuthParse(
    externalAuths: Array<string>,
  ): Promise<Array<JSON>> {
    const externalAuthReponse = [];
    externalAuths.forEach((externalAuth) => {
      externalAuthReponse.push(JSON.parse(externalAuth));
    });
    return externalAuthReponse;
  }

  async getCustomerRelatedData(
    customer: CustomerModel | Record<string, any>,
    requiredFields: Array<string>,
  ): Promise<Record<string, any>> {
    const { customFields, standardFields } = requiredFields.reduce(
      (acc, field) => {
        if (Object.values(CUSTOMER_CUSTOM_FIELDS).includes(field)) {
          acc.customFields.push(field);
        } else if (Object.values(CUSTOMER_STANDARD_FIELDS).includes(field)) {
          acc.standardFields.push(field);
        }
        return acc;
      },
      { customFields: [], standardFields: [] } as {
        customFields: string[];
        standardFields: string[];
      },
    );

    const profileResponse = {};

    const customerCustomFields = customer?.custom?.fields;

    if (standardFields.length > 0) {
      for (const element of standardFields) {
        // Object.prototype.hasOwnProperty.call to check if the property exists avoid obj.hasOwnProperty
        if (
          customer &&
          Object.prototype.hasOwnProperty.call(customer, element)
        ) {
          profileResponse[element] = customer[element] ?? null;
        }
      }
    }

    // default values
    if (requiredFields.includes(CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_HASWALLET)) {
      profileResponse[CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_HASWALLET] = false;
    }
    if (requiredFields.includes(CUSTOMER_CUSTOM_FIELDS.CF_IS_LARGE_ACCOUNT)) {
      profileResponse['isLargeAccount'] = false;
    }

    if (customFields.length > 0 && customerCustomFields) {
      for (const element of customFields) {
        if (
          Object.prototype.hasOwnProperty.call(customerCustomFields, element)
        ) {
          switch (element) {
            case CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM:
              profileResponse[CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM] =
                JSON.parse(customerCustomFields?.[element]) || {};
              break;
            case CUSTOMER_CUSTOM_FIELDS.CF_TENANT:
              profileResponse['channelId'] = customerCustomFields?.[element].id;
              profileResponse['tenantId'] =
                await this.channelFactoryRepository.repository.getKeyById(
                  customerCustomFields?.[element].id,
                );
              break;
            case CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH:
              profileResponse[CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH] =
                await this.getExternalAuthParse(
                  customerCustomFields?.[element],
                );
              break;
            case CUSTOMER_CUSTOM_FIELDS.CF_IS_LARGE_ACCOUNT:
              profileResponse['isLargeAccount'] = true;
              break;
            case CUSTOMER_CUSTOM_FIELDS.CF_WALLET_INFO: {
              const walletInfo =
                JSON.parse(
                  customerCustomFields?.[CUSTOMER_CUSTOM_FIELDS.CF_WALLET_INFO],
                ) || [];
              if (Array.isArray(walletInfo) && walletInfo.length > 0) {
                profileResponse[CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_HASWALLET] =
                  true;
              }
              break;
            }
            default:
              switch (CUSTOMER_CUSTOM_FIELDS_DATATYPE[element] ?? '') {
                case 'array':
                  profileResponse[element] =
                    customerCustomFields[element] ?? [];
                  break;
                case 'json':
                  profileResponse[element] =
                    customerCustomFields[element] ?? {};
                  break;
                case 'datetime':
                  profileResponse[element] =
                    customerCustomFields[element] ?? null;
                  break;
                case 'boolean':
                  profileResponse[element] =
                    customerCustomFields[element] ?? false;
                  break;
                default:
                  profileResponse[element] =
                    customerCustomFields[element] ?? null;
                  break;
              }
              break;
          }
        }
      }
    }

    // TODO: add addresses support
    return { ...profileResponse };
  }

  getNodeType(
    immediateParentId: string | null,
    isCompany: boolean,
    hasChildren: boolean,
  ): NodeType {
    if (isCompany) {
      return NodeType.ROOT;
    } else if (immediateParentId && hasChildren) {
      return NodeType.BRANCH;
    } else if (immediateParentId && !hasChildren) {
      return NodeType.LEAF;
    }
    return NodeType.DEFAULT;
  }

  /**
   *
   * @param customer
   * @param expansions
   */
  async toArrayLite(
    customer: CustomerModel,
    expansions?: string[],
  ): Promise<Partial<Customer>> {
    // Get the profile data from the customer for the required fields
    const profile = await this.getCustomerRelatedData(customer, [
      CUSTOMER_STANDARD_FIELDS.id,
      CUSTOMER_STANDARD_FIELDS.customerNumber,
      CUSTOMER_STANDARD_FIELDS.email,
      CUSTOMER_STANDARD_FIELDS.firstName,
      CUSTOMER_STANDARD_FIELDS.lastName,
      CUSTOMER_STANDARD_FIELDS.isEmailVerified,
      CUSTOMER_STANDARD_FIELDS.createdAt,
      CUSTOMER_STANDARD_FIELDS.externalId,
      CUSTOMER_STANDARD_FIELDS.locale,
      CUSTOMER_CUSTOM_FIELDS.CF_TAGS,
      CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM,
      CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH,
      CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_HASWALLET,
      CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_ISACTIVE,
      CUSTOMER_CUSTOM_FIELDS.CF_PIXART_ACCOUNT_ROLES,
      CUSTOMER_CUSTOM_FIELDS.CF_TESTACCOUNT,
      CUSTOMER_CUSTOM_FIELDS.CF_TENANT,
    ]);

    if (profile?.isActive === undefined) {
      profile.isActive = true;
    }
    if (profile?.testAccount === undefined) {
      profile.testAccount = false;
    }

    // --- Addresses ---
    if (expansions.includes(CUSTOMER_EXPANDABLES.EXPAND_INHERIT_ADDRESSES)) {
      profile['addresses'] =
        await this.addressService.getAddressesWithInheritance(customer);
    } else if (expansions.includes(CUSTOMER_EXPANDABLES.EXPAND_ADDRESSES)) {
      profile['addresses'] = this.addressService.getCustomerAddresses(customer);
    }

    // --- Business Data ---
    if (expansions.includes(CUSTOMER_EXPANDABLES.EXPAND_DETAILED) && customer) {
      profile[CUSTOMER_STANDARD_FIELDS.companyName] =
        customer.companyName ?? null;

      // Add the business data fields to the profile
      const businessDataFields = [
        ...Object.values(CUSTOMER_METADATA_FIELDS),
        ...Object.values(CUSTOMER_METADATA_FIELDS_READONLY),
        CUSTOMER_CUSTOM_FIELDS.CF_IS_LARGE_ACCOUNT,
      ];

      const businessData = await this.getCustomerRelatedData(
        customer,
        businessDataFields,
      );
      delete businessData[CUSTOMER_CUSTOM_FIELDS.CF_LOGIN_MEDIUM];
      profile['businessData'] = businessData;
    }

    // --- MLAM ---
    const rootParentId = this.mlamService.getParentId(customer);
    const immediateParentId = this.mlamService.getImmediateParentId(customer);
    const isCompany = this.mlamService.isCompany(customer);
    const childrens =
      customer?.custom?.fields?.[CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMERS_REFERENCE];
    if (rootParentId || isCompany) {
      const mlam = {
        childrens: [],
        immediateParentId: immediateParentId,
        rootParentId: rootParentId,
        nodeType: this.getNodeType(
          immediateParentId,
          isCompany,
          childrens?.length > 0,
        ),
      };
      if (childrens?.length > 0) {
        if (expansions.includes(CUSTOMER_EXPANDABLES.EXPAND_CHILDREN)) {
          mlam['childrens'] = [];
          if (customer?.custom && childrens?.length > 0) {
            for (const children of childrens) {
              if (children?.obj) {
                mlam['childrens'].push(
                  await this.toArrayLite(children?.obj, expansions),
                );
              }
            }
          }
        } else {
          mlam['childrens'] = this.mlamService.getChildIds(customer);
        }
      }
      if (customer?.custom?.fields?.[CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ROLE]) {
        mlam['companyRole'] =
          customer.custom.fields[CUSTOMER_CUSTOM_FIELDS.CF_COMPANY_ROLE];
      }
      if (customer?.key) {
        mlam['key'] = customer.key;
      }
      profile['mlam'] = mlam;
    }

    // --- Registered From Channel ---
    const registeredFromChannel = {
      id: profile?.['channelId'] || null,
      key: profile?.['tenantId'] || null,
    };
    delete profile['channelId'];
    delete profile['tenantId'];

    // TODO: We will implement wallets
    // --- Wallets ---
    // if (profile.hasWallet) {
    //   profile['wallets'] = {
    //     walletId: {
    //       tenant: '',
    //       type: 'cash',
    //     },
    //   };
    // }
    // delete profile['hasWallet'];

    // --- Auth ---
    const auth = {
      externalAuth: profile[CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH],
      loginMedium:
        customer.custom?.fields?.loginMedium ||
        customer.authenticationMode ||
        null,
    };
    delete profile[CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH];

    // --- Registered From Store ---
    if (customer?.stores) {
      profile['stores'] = [];
      customer?.stores.forEach((store) => {
        profile['stores'].push(store?.key);
      });
    }
    const registeredFromStore = this._parseRegisteredFromStore(
      customer.custom?.fields?.registeredFromStore,
    );

    // --- Customer Group ---
    const customerGroup = {} as ResourceIdentity;
    if (customer?.customerGroup || customer?.customerGroup?.obj) {
      customerGroup['key'] = customer?.customerGroup
        ? customer?.customerGroup?.obj?.key
        : null;
      customerGroup['id'] = customer?.customerGroup
        ? customer?.customerGroup?.obj?.id
        : null;
      profile['customerGroup'] = customerGroup;
    }

    // TODO: We will implement events
    // --- Events ---
    if (expansions.includes(CUSTOMER_EXPANDABLES.EXPAND_EVENTS)) {
      profile['events'] = {
        fired: {},
        received: {},
      };
    }

    // --- Main Response ---
    return {
      ...profile,
      auth,
      registeredFromStore,
      registeredFromChannel,
    };
  }

  private _parseRegisteredFromStore(
    registeredFromStore: string | undefined,
  ): RegisteredFromStore | null {
    if (!registeredFromStore) {
      return null;
    }
    try {
      return JSON.parse(registeredFromStore);
    } catch {
      return null;
    }
  }

  /**
   * Check if the key is valid and cast the value to the appropriate type
   * @param key
   * @param value
   */
  async checkKeyAndCast(key: string, value: unknown) {
    if (typeof value === 'boolean' && value) {
      return true;
    }

    if (!value) {
      return false;
    }

    if (Object.values(CUSTOMER_METADATA_FIELDS).includes(key)) {
      const dataType = CUSTOMER_CUSTOM_FIELDS_DATATYPE[key];
      let value = null;
      switch (dataType) {
        case 'number':
          value = parseFloat(value);
          break;
        case 'boolean':
          value = Boolean(value);
          break;
        default:
          value = String(value);
          break;
      }
      return value;
    }
    return false;
  }
}
