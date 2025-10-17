import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ChannelModel,
  CoreRegisterCustomerDTO,
  CustomerGroupModel,
  CustomerModel,
} from '@comcore/ocs-lib-corecommerce';
import { CustomerUpdateAction } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import {
  ExecutionProfiler,
  ITenantConfigService,
  LoggingService,
  TENANT_CONFIG_SERVICE,
  WorkspaceService,
} from '@comcore/ocs-lib-common';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { CustomerNumberGeneratorService } from '../../utils/customer-number-generator/customer-number-generator.service';
import { CUSTOMER_MAPPER, CustomerMapper } from './mappers/customer.mapper';
import { CustomerProviderRepository } from '../repositories/customer-provider.repository';
import {
  EVENT_PUBLISHER_SERVICE,
  EventPublisherService,
} from '../../utils/eventpublisher/services/event.service';
import { CUSTOMER_FACADE, CustomerFacade } from './customer.facade';
import { MlamService } from './mlam.service';
import { OrderServiceToolsService } from '../../utils/order-service-tools/order-service-tools.service';
import {
  LOGIN_MEDIUM,
  CUSTOMER_EXPANDABLES,
  CUSTOMER_METADATA_FIELDS_READONLY,
  CUSTOMER_CUSTOM_FIELDS_KEY,
  CUSTOMER_CUSTOM_FIELDS,
  CUSTOMER_METADATA_FIELDS,
} from '../enums/common.enum';
import { CUSTOMER_REGISTRATION } from '../../utils/eventpublisher/constants/event.constants';
import { ChannelReferenceModel } from '../../channel/models/channel.model';
import { RenderableException } from '../../../exceptions/RenderableException.exception';
import { CUSTOMER_ERROR_CASE, CUSTOMER_ERROR_CODE } from '../enums/errorCode.enum';
import { RegisterCustomerDto } from '../data/dto/register-customer.dto';
import { ExternalAuthDto } from '../data/dto/external-auth.dto';
import { CustomerGroupFacade } from '../../customer-group/services/customer-group.facade';
import { ChannelFacade } from '../../channel/channel.facade';
import { Customer } from '../enums/customer.types';

interface CustomerGroupData {
  id?: string;
  key?: string;
  name?: string;
  [key: string]: unknown;
}

interface EventMetadata {
  isPasswordSet?: boolean;
  isChildRegistration?: boolean;
  [key: string]: unknown;
}

export const CUSTOMER_SERVICE = 'CUSTOMER_SERVICE';

/**
 * Customer Service Implementation
 */
@Injectable()
export class CustomerService {
  private customerNumberGeneratorService: CustomerNumberGeneratorService; // Customer Number Generator Service

  /**
   * Constructor
   * @param tenantConfigService - Service for tenant configuration management
   * @param customerMapper - Mapper for customer data transformation
   * @param configService - Configuration service for application settings
   * @param customerProviderRepository - Repository for customer data operations
   * @param workspaceService - Service for workspace management
   * @param eventPublisherService - Service for publishing events
   * @param customerFacade - Facade for customer profile operations
   * @param customerGroupFacade - Facade for customer group operations
   * @param channelFacade - Facade for channel operations
   * @param mlamService - Service for MLAM operations
   * @param loggingService - Service for logging operations
   * @param customerQueue - Queue for customer-related background tasks
   * @param orderServiceTools - Tools for order service operations
   * @param profiler - Execution profiler for performance monitoring
   */
  constructor(
    @Inject(TENANT_CONFIG_SERVICE)
    private readonly tenantConfigService: ITenantConfigService,
    @Inject(forwardRef(() => CUSTOMER_MAPPER))
    private readonly customerMapper: CustomerMapper,
    private readonly configService: ConfigService,
    private readonly customerProviderRepository: CustomerProviderRepository,
    private readonly workspaceService: WorkspaceService,
    @Inject(EVENT_PUBLISHER_SERVICE)
    private readonly eventPublisherService: EventPublisherService,
    @Inject(CUSTOMER_FACADE)
    private readonly customerFacade: CustomerFacade,
    @Inject(CustomerGroupFacade)
    private readonly customerGroupFacade: CustomerGroupFacade,
    @Inject(ChannelFacade)
    private readonly channelFacade: ChannelFacade,
    @Inject(MlamService)
    private readonly mlamService: MlamService,
    private readonly loggingService: LoggingService,
    @InjectQueue('customer-queue')
    private readonly customerQueue: Queue,
    @Inject(forwardRef(() => OrderServiceToolsService))
    private readonly orderServiceTools: OrderServiceToolsService,
    private readonly profiler: ExecutionProfiler,
  ) {}

  /**
   * Change customer group of customer
   * @param customer - The customer model to update
   * @param customerGroup - The new customer group to assign
   * @param execute - Whether to execute the change immediately
   * @returns Promise<CustomerModel> - The updated customer model
   */
  async changeGroup(
    customer: CustomerModel,
    customerGroup: CustomerGroupModel,
    execute: boolean = true,
  ): Promise<CustomerModel> {
    // Check if customer group is different from the current customer group
    if (
      !(
        customerGroup &&
        customer.customerGroup &&
        customer.customerGroup.obj &&
        customerGroup.key == customer.customerGroup.obj.key
      ) &&
      !(!customerGroup && !customer.customerGroup)
    ) {
      return await this.customerProviderRepository.repository.changeGroup(
        customer,
        customerGroup,
        execute,
      );
    }
    return customer;
  }

  /**
   * Check if the customer is guest or not
   * @param externalAuth - External authentication data to check
   * @returns Promise<boolean> - True if customer is guest, false otherwise
   */
  async isGuest(externalAuth: ExternalAuthDto): Promise<boolean> {
    // Check if the social platform is anonymous
    return externalAuth.socialPlatform?.toLowerCase() === 'anonymous';
  }

  /**
   * Add store to customer
   * @param customer - The customer model to update
   * @param store - The store identifier to add
   * @param execute - Whether to execute the change immediately
   * @returns Promise<CustomerModel> - The updated customer model
   */
  async addStore(
    customer: CustomerModel,
    store: string,
    execute: boolean = true,
  ): Promise<CustomerModel> {
    // Check if the store is not already added to the customer
    return await this.customerProviderRepository.repository.addStore(customer, store, execute);
  }

  /**
   * Fetch customer by ID
   * @param customerId - The unique identifier of the customer
   * @param noCache - Whether to bypass cache and fetch fresh data
   * @returns Promise<CustomerModel | null> - The customer model or null if not found
   */
  async fetchCustomerById(
    customerId: string,
    noCache: boolean = false,
  ): Promise<CustomerModel | null> {
    // Fetch customer by id
    return await this.customerFacade.fetchCustomerById(customerId, noCache);
  }

  /**
   * Get store register action
   * @param customer - The customer model to process
   * @param profile - The customer profile data
   * @param stores - Array of store identifiers to register
   * @param isGuest - Whether the customer is a guest
   * @returns Promise<Array<CustomerUpdateAction | ActionResult>> - Array of actions to be performed
   */
  async getStoreRegisterAction(
    customer: CustomerModel,
    profile: Record<string, unknown>,
    stores: Array<string>,
    isGuest: boolean,
  ): Promise<Array<CustomerUpdateAction>> {
    if (stores.length == 0) {
      return [];
    } // No stores to add

    // Get stores that the customer already has
    const hasStores = [];
    customer?.stores.forEach((store) => {
      hasStores.push(store.key);
    });

    // Get actions to be performed
    const actions = [];
    // Get the registrations of the customer
    const registrations = profile[CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM] ?? {};
    // Add the stores to the customer those are not added
    for (const store of stores) {
      // Check if the store is not already added to the customer
      if (!hasStores.includes(store)) {
        actions.push(await this.addStore(customer, store, false));
        const storeConfig = await this.tenantConfigService.get(
          this.workspaceService.getWorkspace(),
          'newClient',
          store,
        );
        if (!customer?.custom?.fields?.[storeConfig?.flag]) {
          actions.push(await this.setCustomField(customer, storeConfig?.flag, true, false));
        }
      }
      // Add the store to the registrations details of the customer
      if (Object.prototype.hasOwnProperty.call(registrations, store)) {
        registrations[store] = new Date().toISOString();
      }
    }
    // Set the registrations details of the customer if customer is not guest
    if (!isGuest) {
      actions.push(
        await this.setCustomField(
          customer,
          CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM,
          JSON.stringify(registrations),
          false,
        ),
      );
    }
    return actions;
  }

  /**
   * Change company name of customer
   * @param customer
   * @param companyName
   * @param execute
   * @returns
   */
  async changeCompanyName(customer: CustomerModel, companyName: string, execute: boolean = true) {
    // Check if the company name is different from the current company name
    if (companyName != customer?.companyName) {
      return await this.customerProviderRepository.repository.changeCompanyName(
        customer,
        companyName,
        execute,
      );
    }
    return { ...customer } as CustomerModel;
  }

  /**
   * Change vat id of customer
   * @param customer
   * @param vatId
   * @param execute
   * @returns
   */
  async changeVatId(customer: CustomerModel, vatId: string, execute: boolean = true) {
    // Check if the vat id is different from the current vat id
    if (vatId != customer?.vatId) {
      return await this.customerProviderRepository.repository.changeVatId(customer, vatId, execute);
    }
    return { ...customer } as CustomerModel;
  }

  /**
   * Change email of customer
   * @param oldEmail - The current email address of the customer
   * @param newEmail - The new email address to set for the customer
   * @returns Partial<Customer> - The updated customer data with expanded details
   */

  async changeEmail(oldEmail: string, newEmail: string) {
    try {
      this.profiler.mark('fetch-old-customer-start');

      // Fetch the customer by old email
      let customer: CustomerModel | null = await this.customerFacade.fetchCustomerByEmail(oldEmail);
      this.profiler.mark('fetch-old-customer-end');

      // If the old email is the same as the new email, return the customer
      if (oldEmail === newEmail) {
        return customer;
      }

      // If customer is not found, throw an error
      if (!customer) {
        throw new RenderableException(
          `Customer with email ${oldEmail} could not be found.`,
          null,
          CUSTOMER_ERROR_CODE.PROFILE_NOT_FOUND,
          null,
          404,
          [],
          CUSTOMER_ERROR_CASE.PROFILE_NOT_FOUND,
        );
      }

      // Check if the customer is available with new email
      this.profiler.mark('fetch-new-customer-start');
      const existingCustomer = await this.customerFacade.fetchCustomerByEmail(newEmail);
      this.profiler.mark('fetch-new-customer-end');

      // If a customer with the new email already exists, throw an error
      if (existingCustomer) {
        throw new RenderableException(
          `A customer with email ${newEmail} already exists.`,
          null,
          CUSTOMER_ERROR_CODE.EMAIL_ALREADY_EXISTS,
          null,
          409,
          [],
          CUSTOMER_ERROR_CASE.EMAIL_ALREADY_EXISTS,
        );
      }

      // Change the email of the customer
      this.profiler.mark('change-email-start');
      customer = await this.customerProviderRepository.repository.changeEmail(
        customer,
        newEmail,
        true,
      );
      this.profiler.mark('change-email-end');

      // Refresh the customer cache and publish the event
      this.profiler.mark('cache-update-start');
      await this.customerFacade.refreshCustomerCache(customer, oldEmail);
      this.profiler.mark('cache-update-end');

      this.profiler.mark('event-publish-start');
      await this.customerQueue.add(
        'customer-email-updated-event',
        {
          customer,
          oldEmail,
          newEmail,
          workspace: this.workspaceService.getWorkspace(),
        },
        {
          attempts: 3,
          backoff: 5000,
        },
      );
      this.profiler.mark('event-publish-end');

      this.profiler.mark('updateCustomerEmailInCarts-start');
      try {
        // Update the customer email in all carts and orders
        await this.orderServiceTools.updateCustomerEmail(customer, oldEmail, newEmail);
      } catch (error) {
        this.loggingService.error(
          ['ProfileService'],
          'Failed to update customer carts in order service',
          { oldEmail, newEmail, customerId: customer.id },
          error,
        );

        throw new RenderableException(
          'Failed to update carts after email change.',
          null,
          CUSTOMER_ERROR_CODE.EMAIL_UPDATE_SUCCESSFUL_CART_UPDATE_FAILED,
          null,
          500,
          [],
          CUSTOMER_ERROR_CASE.EMAIL_UPDATE_SUCCESSFUL_CART_UPDATE_FAILED,
        );
      }
      this.profiler.mark('updateCustomerEmailInCarts-end');
      return await this.customerMapper.toArray(customer, [CUSTOMER_EXPANDABLES.EXPAND_DETAILED]);
    } catch (error) {
      this.loggingService.error(
        ['ProfileService'],
        'ProfileService.changeEmail error',
        { oldEmail, newEmail },
        error,
      );

      if (error instanceof RenderableException) {
        throw error;
      }

      throw new RenderableException(
        'Error occurred while updating customer email',
        null,
        CUSTOMER_ERROR_CODE.EMAIL_CHANGE_FAILED,
        null,
        500,
        [],
        CUSTOMER_ERROR_CASE.EMAIL_CHANGE_FAILED,
      );
    } finally {
      this.profiler.mark('changeEmail-end');
      this.loggingService.debug(
        ['ExecutionProfiler'],
        'ProfileService.changeEmail Timing',
        this.profiler.calculate(),
      );
    }
  }

  /**
   * Add new store registration
   * @param customer
   * @param customer
   * @param newStores
   * @param request
   * @param isGuest
   * @returns
   */
  async addNewStoreRegistration(
    customer: CustomerModel,
    profile: Record<string, unknown>,
    newStores: Array<string>,
    request: RegisterCustomerDto,
    isGuest: boolean = false,
  ): Promise<CustomerModel> {
    // Get the actions to be performed for store registration
    const actions = await this.getStoreRegisterAction(customer, profile, newStores, isGuest);

    // Set the company name, vat id and metadata of the customer
    if (request?.companyName) {
      actions.push(await this.changeCompanyName(customer, request?.companyName, false));
    }
    // Set the vat id of the customer
    if (request?.vatId) {
      actions.push(await this.changeVatId(customer, request?.vatId, false));
    }

    // Set the metadata of the customer
    const metadata = request?.businessData;
    for (const [key, value] of Object.entries(metadata)) {
      if (!Object.prototype.hasOwnProperty.call(profile, key)) {
        if (await this.customerMapper.checkKeyAndCast(key, value)) {
          actions.push(await this.setCustomField(customer, key, value, false));
        }
      }
    }

    // Update the customer with all the actions
    return await this.customerProviderRepository.repository.updateCustomerWithAllActions(
      customer,
      actions,
    );
  }

  /**
   * Set password of customer
   * @param email
   * @param password
   */
  async setPassword(email: string, password: string): Promise<CustomerModel> {
    // Set the password of the customer
    return await this.customerProviderRepository.repository.setPassword(email, password);
  }

  /**
   * Set Custom field of customer
   * @param customer
   * @param fieldName
   * @param fieldValue
   * @param execute
   */
  async setCustomField(
    customer: CustomerModel,
    fieldName: string,
    fieldValue: unknown,
    execute: boolean = true,
  ) {
    // Set the custom field of the customer
    return await this.customerProviderRepository.repository.setCustomField(
      customer,
      fieldName,
      fieldValue,
      execute,
    );
  }

  hasSetPassword(customer: CustomerModel): boolean {
    const fields = customer?.custom?.fields;
    const loginMedium = fields?.[CUSTOMER_CUSTOM_FIELDS.CF_LOGINMEDIUM];

    // set of login mediums that indicate that the customer has not set a password yet
    const passwordlessLoginMediums = [LOGIN_MEDIUM.NONE, LOGIN_MEDIUM.EXTERNAL];

    // NOTE: For customers who don't have the loginMedium field, we assume that they have set a password and return true
    return !loginMedium || !passwordlessLoginMediums.includes(loginMedium);
  }

  async updateLoginMedium(customer: CustomerModel, event: string): Promise<CustomerModel> {
    const fields = customer?.custom?.fields;

    if (fields && CUSTOMER_CUSTOM_FIELDS.CF_LOGINMEDIUM in fields) {
      const currentLoginMedium = String(fields[CUSTOMER_CUSTOM_FIELDS.CF_LOGINMEDIUM]); // equivalent to getFieldAsString

      let newMedium: string | null = null;

      if (event === 'PASSWORD_SET') {
        switch (currentLoginMedium) {
          case LOGIN_MEDIUM.EXTERNAL:
            newMedium = LOGIN_MEDIUM.BOTH;
            break;
          case LOGIN_MEDIUM.NONE:
            newMedium = LOGIN_MEDIUM.PASSWORD;
            break;
          default:
            newMedium = null;
        }
      }

      if (newMedium) {
        return await this.setCustomField(
          customer,
          CUSTOMER_CUSTOM_FIELDS.CF_LOGINMEDIUM,
          newMedium,
        );
      }
    }

    return customer;
  }

  /**
   * Handle existing customer
   * @param customer
   * @param channel
   * @param customerGroup
   * @param password
   * @param request
   * @param isGuest
   * @param profileRegistrationWithoutPassword
   */
  async handleExistingCustomer(
    customer: CustomerModel,
    channel: ChannelModel,
    customerGroup: CustomerGroupModel,
    password: string,
    request: RegisterCustomerDto,
    isGuest: boolean,
    profileRegistrationWithoutPassword: boolean,
  ) {
    // Get the stores to be added
    const stores = request.stores?.length ? request.stores : [channel.custom.fields.storeKey];

    // Get the metadata fields
    const metadataFields = [
      ...Object.values(CUSTOMER_METADATA_FIELDS),
      ...Object.values(CUSTOMER_METADATA_FIELDS_READONLY),
    ];

    // Get the customer details with the metadata fields and registration details
    const profileDetails = await this.customerMapper.getCustomerRelatedData(customer, [
      CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM,
      CUSTOMER_CUSTOM_FIELDS.CF_TENANT,
      CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH,
      ...metadataFields,
    ]);
    // Get the stores that are not already added to the customer
    const newStores = stores.filter(
      (store) => !profileDetails?.[CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM]?.[store],
    );
    // Check if the customer is existing and the email is already registered
    let customerErrorCode = CUSTOMER_ERROR_CODE.PROFILE_REGISTRATION_FAILED;
    let customerErrorType = CUSTOMER_ERROR_CASE.PROFILE_REGISTRATION_EXISTING_EMAIL;
    if (newStores.length > 0) {
      customer = await this.addNewStoreRegistration(
        customer,
        profileDetails,
        newStores,
        request,
        isGuest,
      );
      customerErrorCode = CUSTOMER_ERROR_CODE.PROFILE_REGISTRATION_FAILED;
      customerErrorType = CUSTOMER_ERROR_CASE.PROFILE_REGISTRATION_STORE_ADDED;
    }

    // Change the customer group of the customer if customer group is sent in the request is valid
    if (customerGroup && Object.keys(customerGroup).length > 0) {
      customer = await this.changeGroup(customer, customerGroup);
    }

    // If previously customer registered/newly loggedIn with external auth (without having password)
    // but later registering with password then set the password and login medium
    if (!profileRegistrationWithoutPassword && !this.hasSetPassword(customer)) {
      // Set the password of the customer and the login medium BOTH
      if (password) {
        customer = await this.setPassword(customer.email, password);
        customer = await this.updateLoginMedium(customer, 'PASSWORD_SET');
      }
      // Publish the customer registration event if customer is not guest
      if (!isGuest && profileDetails[CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM].length > 0) {
        const customerArray = await this.customerMapper.toArray(customer, [
          CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
        ]);
        await this.eventPublisherService.publish(
          channel.key,
          CUSTOMER_REGISTRATION,
          customerArray,
          customerGroup.key,
        );
        const tenantId = channel.key;
        const group = customerGroup.key;
        await this.customerQueue.add(
          'customer-registration-event',
          {
            customer,
            tenantId,
            group,
            workspace: this.workspaceService.getWorkspace(),
          },
          {
            attempts: 3,
            backoff: 5000,
          },
        );
      }
      // Return the customer details
      return await this.customerMapper.toArray(customer, [
        CUSTOMER_EXPANDABLES.EXPAND_ADDRESSES,
        CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
      ]);
    }

    // Throw error if the customer is already existing with the appropriate error code and error type
    throw new RenderableException(
      `Unable to create customer. There is already an existing customer with the email ${customer?.email}`,
      await this.customerMapper.toArrayLite(customer, [
        CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
        CUSTOMER_EXPANDABLES.EXPAND_ADDRESSES,
      ]),
      customerErrorCode,
      null,
      400,
      request,
      customerErrorType,
    );
  }

  /**
   * Create customer draft for registration of the customer
   * @param customerData
   * @param stores
   * @param password
   * @param customerGroup
   * @param locale
   * @param channel
   * @param guestCustomer
   */
  async createCustomerDraft(
    customerData: RegisterCustomerDto,
    stores: string[],
    password: string,
    customerGroup: CustomerGroupData,
    locale: string,
    channel: { key: string; id: string },
    guestCustomer: boolean,
  ) {
    const customerDraft = new CoreRegisterCustomerDTO();
    customerDraft.email = customerData.email;

    if (password) {
      customerDraft.password = password;
    }

    if (customerGroup && Object.keys(customerGroup).length > 0) {
      customerDraft.customerGroup = {
        typeId: 'customer-group',
        id: customerGroup.id,
      };
    }

    if (customerData.firstName) {
      customerDraft.firstName = customerData.firstName;
    }

    if (customerData.lastName) {
      customerDraft.lastName = customerData.lastName;
    }

    if (customerData.companyName) {
      customerDraft.companyName = customerData.companyName;
    }

    if (customerData.vatId) {
      customerDraft.vatId = customerData.vatId;
    }

    if (customerData.externalId) {
      customerDraft.externalId = customerData.externalId;
    }

    if (locale) {
      customerDraft.locale = locale;
    }

    if (customerData.externalId) {
      customerDraft.externalId = customerData.externalId;
    }

    // Generate customer number
    this.customerNumberGeneratorService = new CustomerNumberGeneratorService(
      this.tenantConfigService,
      this.workspaceService,
    );
    await this.customerNumberGeneratorService.initialize(channel.key, stores[0]);
    customerDraft.customerNumber = await this.customerNumberGeneratorService.generate();

    const customerCustomFields = {};

    const channelReferenceModel = new ChannelReferenceModel();
    channelReferenceModel.typeId = 'channel';
    channelReferenceModel.id = channel.id;

    customerCustomFields[CUSTOMER_CUSTOM_FIELDS.CF_TENANT] = channelReferenceModel;

    customerCustomFields[CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_ISACTIVE] = true;

    const registrations = {};
    if (!guestCustomer) {
      stores.forEach((store) => {
        registrations[store] = new Date().toISOString();
      });
      customerCustomFields[CUSTOMER_CUSTOM_FIELDS.CF_REGISTERED_FROM] =
        JSON.stringify(registrations);
    }

    if (customerData.externalAuth) {
      const externalAuthFieldData = {
        source: customerData.externalAuth.socialPlatform,
        referrer_url: customerData.externalAuth.referrerUrl,
        source_crm_agent: '',
      };
      customerCustomFields[CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_ACQUISITION_CHANNEL] =
        JSON.stringify(externalAuthFieldData);
      customerCustomFields[CUSTOMER_CUSTOM_FIELDS.CF_LOGIN_MEDIUM] = LOGIN_MEDIUM.EXTERNAL;
      customerDraft.password = `${customerData.email}_${new Date().toISOString()}_${this.configService.get('SALT')}`;
    } else {
      customerCustomFields[CUSTOMER_CUSTOM_FIELDS.CF_LOGIN_MEDIUM] = LOGIN_MEDIUM.PASSWORD;
    }

    if (customerData.businessData && Object.keys(customerData.businessData).length > 0) {
      for (const [key, value] of Object.entries(customerData.businessData)) {
        if (await this.customerMapper.checkKeyAndCast(key, value)) {
          customerCustomFields[key] = value;
        }
      }
    }

    customerDraft.custom = {
      type: {
        typeId: 'type',
        key: CUSTOMER_CUSTOM_FIELDS_KEY,
      },
      fields: customerCustomFields,
    };

    return customerDraft;
  }

  /**
   * Create customer form the customer draft
   * @param customerDraft
   */
  async createCustomerFromDraft(customerDraft: CoreRegisterCustomerDTO) {
    return await this.customerProviderRepository.repository.createCustomerFromDraft(customerDraft);
  }

  /**
   * Get the external auth details of the customer
   * @param customer
   */
  async getExternalAuth(customer: CustomerModel) {
    let externalAuth = [];
    if (
      customer.custom &&
      customer.custom.fields &&
      Object.prototype.hasOwnProperty.call(
        customer.custom.fields,
        CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH,
      )
    ) {
      externalAuth = customer.custom.fields[CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH];
    }
    return externalAuth;
  }

  /**
   * Add external auth details to the customer
   * @param customer
   * @param platform
   * @param timestamp
   * @param uniqueId
   * @param store
   * @param execute
   */
  async addExternalAuth(
    customer: CustomerModel,
    platform: string,
    timestamp: string,
    uniqueId: string,
    store: string,
    execute: boolean = true,
  ) {
    const externalAuth = await this.getExternalAuth(customer);
    const externalAuthObj = JSON.stringify({
      platform: platform.toLowerCase(),
      createdAt: timestamp,
      uniqueId: uniqueId,
      store: store.toLowerCase(),
    });
    externalAuth.push(externalAuthObj);

    return await this.setCustomField(
      customer,
      CUSTOMER_CUSTOM_FIELDS.CF_EXTERNAL_AUTH,
      externalAuth,
      execute,
    );
  }

  /**
   * Add store after registration
   * @param customer
   * @param stores
   * @param customerData
   */
  async addStoreAfterRegistration(
    customer: CustomerModel,
    stores: Array<string>,
    customerData: RegisterCustomerDto,
  ) {
    const actions = [];
    for (const store of stores) {
      if (customerData?.externalAuth) {
        actions.push(
          await this.addExternalAuth(
            customer,
            customerData.externalAuth.socialPlatform,
            customer.createdAt,
            customerData.externalAuth.uniqueId,
            store,
            false,
          ),
        );
      }
      actions.push(await this.addStore(customer, store, false));
      const storeConfig = await this.tenantConfigService.get(
        this.workspaceService.getWorkspace(),
        'newClient',
        store,
      );
      if (!customer?.custom?.fields?.[storeConfig?.flag]) {
        actions.push(await this.setCustomField(customer, storeConfig?.flag, true, false));
      }
    }
    return await this.customerProviderRepository.repository.updateCustomerWithAllActions(
      customer,
      actions,
    );
  }

  /**
   * Check if the customer registration is without password
   * @param externalAuth
   */
  isProfileRegistrationWithoutPassword(externalAuth: ExternalAuthDto): boolean {
    return externalAuth.socialPlatform?.toLowerCase() === 'without_password';
  }

  /**
   * Check if the customer is active or not
   * @param customer
   */
  isActiveCustomer(customer: CustomerModel): boolean {
    return customer?.custom?.fields?.[CUSTOMER_CUSTOM_FIELDS.CF_CUSTOMER_ISACTIVE] === true;
  }

  /**
   *
   * @param customer
   * @param key
   * @param value
   * @param execute
   */
  async setKey(customer: CustomerModel, key: string, execute: boolean = true) {
    return await this.customerProviderRepository.repository.setKey(customer, key, execute);
  }

  getTenantId(customer: CustomerModel) {
    return customer.custom?.fields?.tenant?.id;
  }

  getCustomerGroupKey(customer: CustomerModel) {
    return customer.customerGroup?.obj?.key;
  }

  getIsCompany(customer: CustomerModel) {
    return customer.custom?.fields?.isCompany === true;
  }

  getCompanyIdFromCustomer(customer: CustomerModel) {
    return customer.custom?.fields?.companyId;
  }

  /**
   * Register the customer
   * @param data
   * @returns
   */
  async registerCustomer(data: RegisterCustomerDto): Promise<Partial<Customer>> {
    let guestCustomer = false;
    let profileRegistrationWithoutPassword = false;
    let tenantId = data.tenantId;
    const group = data.group;
    let locale = data.locale ?? null;
    let parentCustomer = null;

    // Remove password from data
    const { password, ...customerData } = data;

    if (customerData.immediateParentId) {
      parentCustomer = await this.customerFacade.fetchCustomerById(
        customerData.immediateParentId,
        true,
      );
    }

    // Check if the customer is guest and get details of tenantId, group and locale from external auth
    if (customerData.externalAuth) {
      tenantId = customerData.externalAuth.tenantId ?? tenantId;
      guestCustomer = await this.isGuest(customerData.externalAuth);
      profileRegistrationWithoutPassword = this.isProfileRegistrationWithoutPassword(
        customerData.externalAuth,
      );
      locale = customerData.externalAuth.locale ?? locale;
    }

    // Check if the tenantId is not empty and if empty then assign group to it
    tenantId = tenantId || group;
    // Throw error if tenantId is not present
    if (!tenantId) {
      throw new RenderableException(
        'Unable to create customer. Field tenantId is required and must not be empty.',
        null,
        CUSTOMER_ERROR_CODE.PROFILE_REGISTRATION_FAILED,
        null,
        400,
        customerData,
        CUSTOMER_ERROR_CASE.CHANNEL_NOT_PASSED,
      );
    }

    // Fetch data concurrently
    const results = await Promise.allSettled([
      this.customerFacade.fetchCustomerByEmail(customerData.email),
      group ? this.customerGroupFacade.fetchGroupUsingKey(group) : Promise.resolve(null),
      this.channelFacade.fetchChannelByKey(tenantId),
    ]);

    // Map the results, handling rejected promises
    const [customer, customerGroup, channel] = results.map((result) =>
      result.status === 'fulfilled' ? Object.assign({}, result.value) : null,
    );
    let customerTemp = customer;

    // Throw error if channel is not found
    if (!channel) {
      throw new RenderableException(
        'Channel not found for the given tenantId.',
        null,
        CUSTOMER_ERROR_CODE.PROFILE_REGISTRATION_FAILED,
        null,
        404,
        customerData,
        CUSTOMER_ERROR_CASE.CHANNEL_NOT_FOUND,
      );
    }

    // If customerTemp is already present add stores which are not present and put login medium as both
    if (Object.keys(customerTemp).length > 0) {
      customerTemp = await this.handleExistingCustomer(
        customerTemp,
        channel,
        customerGroup,
        password,
        customerData,
        guestCustomer,
        profileRegistrationWithoutPassword,
      );
    }

    let stores = customerData.stores ?? [];
    if (customerData.store) {
      stores = [customerData.store];
    }

    if (stores.length == 0) {
      stores.push(channel.custom.fields.storeKey);
    }

    // Create customer draft
    const customerDraft = await this.createCustomerDraft(
      customerData,
      stores,
      password,
      customerGroup,
      locale,
      channel,
      guestCustomer,
    );

    customerTemp = await this.createCustomerFromDraft(customerDraft);

    await this.customerQueue.add(
      'customer-registration-pca',
      {
        customer: customerTemp,
        stores,
        customerData,
        tenantId,
        group,
        workspace: this.workspaceService.getWorkspace(),
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );

    let addChildFailedException = null;
    if (customerData.immediateParentId && parentCustomer) {
      try {
        customerTemp = await this.mlamService.addChild(
          parentCustomer,
          customerTemp,
          customerData.companyRole,
        );
      } catch (error) {
        this.loggingService.error(
          ['customer-registration'],
          `Error adding child to parent: ${error}`,
          error,
          error,
        );
        addChildFailedException = error;
      }
    }

    // fetch Customer to get updated data from commercetool
    customerTemp = await this.fetchCustomerById(customerTemp.id, true);
    const customerArray = await this.customerMapper.toArray(customerTemp, [
      CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
    ]);
    tenantId = customerArray['registeredFromChannel']['key'];

    let eventMetaData: EventMetadata = {};

    if (profileRegistrationWithoutPassword) {
      eventMetaData = {
        isPasswordSet: false,
        isChildRegistration: customerData.immediateParentId && !addChildFailedException,
      };
    }

    await this.customerQueue.add(
      'customer-registration-event',
      {
        customer: customerTemp,
        guestCustomer,
        stores,
        customerData,
        tenantId,
        group,
        eventMetaData,
        workspace: this.workspaceService.getWorkspace(),
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );

    if (addChildFailedException) {
      let errorDetail: object | string | null = null;
      let httpStatus = 500;

      if (addChildFailedException instanceof RenderableException) {
        errorDetail = addChildFailedException.getDetail();
        httpStatus = addChildFailedException.getHttpStatus();
      }

      throw new RenderableException(
        'Customer registration is successful, but linking to parent customer failed.',
        errorDetail,
        CUSTOMER_ERROR_CODE.PROFILE_REGISTRATION_FAILED,
        null,
        httpStatus,
        customerData,
        CUSTOMER_ERROR_CASE.PROFILE_REGISTRATION_SUCCESSFUL_ADD_CHILD_FAILED,
      );
    }

    // Return the customer details
    return customerArray;
  }

  async getCustomerById(customerId: string, noCache: boolean = false) {
    try {
      this.profiler.mark('fetch-customer-start');
      const customer = await this.fetchCustomerById(customerId, noCache);

      this.profiler.mark('fetch-customer-end');
      if (!customer) {
        throw new RenderableException(
          `Customer with id ${customerId} not found.`,
          null,
          CUSTOMER_ERROR_CODE.PROFILE_NOT_FOUND,
          null,
          404,
          [],
          CUSTOMER_ERROR_CASE.PROFILE_NOT_FOUND,
        );
      }
      const result = await this.customerMapper.toArray(customer, [
        CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
        CUSTOMER_EXPANDABLES.EXPAND_ADDRESSES,
      ]);

      return result;
    } catch (error) {
      this.loggingService.error(
        ['getting-customer'],
        `Error fetching customer: ${error}`,
        error,
        error,
      );
      if (error instanceof RenderableException) {
        throw error;
      }
      throw new RenderableException(
        `Error fetching customer with id ${customerId}.`,
        null,
        CUSTOMER_ERROR_CODE.PROFILE_NOT_FOUND,
        null,
        404,
        [],
        CUSTOMER_ERROR_CASE.PROFILE_NOT_FOUND,
      );
    } finally {
      this.profiler.mark('getCustomerById-end');
      this.loggingService.debug(
        ['ExecutionProfiler'],
        'ProfileService.getCustomerById Timing',
        this.profiler.calculate(),
      );
    }
  }
}
