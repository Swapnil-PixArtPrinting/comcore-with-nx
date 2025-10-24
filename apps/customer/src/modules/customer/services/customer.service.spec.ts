import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CustomerService } from './customer.service';
import { CustomerModel } from '@app/corecommerce';
import { CustomerMapper } from './mappers/customer.mapper';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerMapper: CustomerMapper;

  beforeEach(async () => {
    customerMapper = {
      toArray: jest.fn(),
    } as any;
    // Minimal mock dependencies for constructor
    const mockTenantConfigService = {};
    const mockConfigService = {};
    const mockCustomerProviderRepository = {};
    const mockWorkspaceService = {};
    const mockEventPublisherService = {};
    const mockProfileFacade = {};
    const mockCustomerGroupFacade = {};
    const mockChannelFacade = {};
    const mockMlamService = {};
    const mockLoggingService = { error: jest.fn(), debug: jest.fn() };
    const mockCustomerQueue = {};
    const mockOrderServiceTools = {};
    const mockProfiler = { mark: jest.fn(), calculate: jest.fn() };
    service = new CustomerService(
      mockTenantConfigService as any,
      customerMapper as any,
      mockConfigService as any,
      mockCustomerProviderRepository as any,
      mockWorkspaceService as any,
      mockEventPublisherService as any,
      mockProfileFacade as any,
      mockCustomerGroupFacade as any,
      mockChannelFacade as any,
      mockMlamService as any,
      mockLoggingService as any,
      mockCustomerQueue as any,
      mockOrderServiceTools as any,
      mockProfiler as any,
    );
  });

  it('should map customer customer using profileMapper.toArray', async () => {
    const customer: CustomerModel = {
      id: 'c08b7471-41c1-4153-9fb4-d537eb371d3a',
      version: 19,
      versionModifiedAt: '2025-08-12T11:11:05.332Z',
      lastMessageSequenceNumber: 8,
      createdAt: '2023-05-12T07:27:56.580Z',
      lastModifiedAt: '2025-08-12T11:11:05.332Z',
      lastModifiedBy: {
        clientId: '9B-9qjs_qaP6MIxnOkd1pAq9',
        isPlatformClient: false,
        externalUserId: 'shubham.zope4@pixartprinting.com',
      },
      createdBy: {
        clientId: '9B-9qjs_qaP6MIxnOkd1pAq9',
        isPlatformClient: false,
      },
      customerNumber: 'GIF62bced85x9120x48f4x8331x138eccae8a6e',
      email: 'swapnil.bhamat0@pixartprinting.com',
      locale: 'en-GB',
      companyName: 'abc',
      vatId: 'test',
      password: '****SUA=',
      addresses: [
        {
          id: 'XPVriYQr',
          firstName: 'Swapnil',
          lastName: 'Bhamat',
          streetName: 'A, Selborne Mansions, Selborne Mount',
          streetNumber: '100',
          postalCode: 'BD9 4NP',
          city: 'Bradford',
          country: 'GB',
          phone: '07798582132',
          key: 'c08b7471-41c1-4153-9fb4-d537eb371d3a-XPVriYQr',
          // removed createdAt, lastModifiedAt, lastModifiedBy, isActive
        } as any,
      ],
      defaultShippingAddressId: 'XPVriYQr',
      shippingAddressIds: ['XPVriYQr'],
      billingAddressIds: [],
      isEmailVerified: false,
      customerGroup: {
        typeId: 'customer-group' as const,
        id: 'aa329077-9a4c-4e9d-8415-4c390a90fa14',
        obj: {
          id: 'aa329077-9a4c-4e9d-8415-4c390a90fa14',
          version: 3,
          createdAt: '2018-06-07T14:42:47.529Z',
          lastModifiedAt: '2020-04-24T11:30:42.237Z',
          lastModifiedBy: {
            clientId: '9B-9qjs_qaP6MIxnOkd1pAq9',
            isPlatformClient: false,
          },
          name: 'demo_company',
          key: 'demo_company',
          custom: {
            type: {
              typeId: 'type' as const,
              id: '1474e5ed-0670-4b2b-b167-9ac2d0a36960',
            },
            fields: {
              storeKey: 'hub',
            },
          },
        },
      },
      customerGroupAssignments: [],
      custom: {
        type: {
          typeId: 'type',
          id: '182c9501-7637-4084-a879-82f297d645fd',
        },
        fields: {
          loginMedium: 'PASSWORD',
          user_preferences_analysis_acceptance: '2023-05-12T07:27:55.634Z',
          registeredFromStore:
            '{"gifta":"2023-05-12T07:27:56Z","pixartprinting":"2025-08-12T11:11:04.586Z"}',
          cx_user_newclient: false,
          tenant: {
            typeId: 'channel',
            id: '325d11f8-be17-4c14-8d8c-4c35bade70f4',
          },
          user_category: '4',
          user_preferences_analysis: '0',
          cx_user_subscriber_status: '0',
          user_newclient: true,
          user_last_login: '2023-05-15T11:09:04Z',
          cx_user_subscriber_date_optin: '2023-05-12T07:27:55.634Z',
          user_pixartpro_status: '1',
          user_country_name: 'GB',
          cx_confirm_items_ordered: 5,
        },
      },
      stores: [
        { key: 'gifta', typeId: 'store' },
        { key: 'pixartprinting', typeId: 'store' },
      ],
      authenticationMode: 'Password',
    } as CustomerModel;

    const expansions = ['EXPAND_DETAILED', 'EXPAND_ADDRESSES'];
    const expectedResult = {
      id: 'c08b7471-41c1-4153-9fb4-d537eb371d3a',
      customerNumber: 'GIF62bced85x9120x48f4x8331x138eccae8a6e',
      email: 'swapnil.bhamat0@pixartprinting.com',
      isEmailVerified: false,
      createdAt: '2023-05-12T07:27:56.580Z',
      locale: 'en-GB',
      registeredFromStore: {
        gifta: '2023-05-12T07:27:56Z',
        pixartprinting: '2025-08-12T11:11:04.586Z',
      },
      addresses: {
        billing: {},
        shipping: {
          XPVriYQr: {
            id: 'XPVriYQr',
            firstName: 'Swapnil',
            lastName: 'Bhamat',
            streetName: 'A, Selborne Mansions, Selborne Mount',
            streetNumber: '100',
            postalCode: 'BD9 4NP',
            city: 'Bradford',
            country: 'GB',
            phone: '07798582132',
            key: 'c08b7471-41c1-4153-9fb4-d537eb371d3a-XPVriYQr',
            createdAt: '2023-05-12T07:41:26Z',
            lastModifiedAt: '2023-05-12T07:41:26Z',
            lastModifiedBy: 'KkSNoIBM4hBDanDS7wW0IdLQNZdhl8gJ@clients',
            isActive: true,
            isDefault: true,
          },
        },
        defaultShippingAddressId: 'XPVriYQr',
      },
      companyName: 'abc',
      businessData: {
        isLargeAccount: false,
        user_category: '4',
        user_country_name: 'GB',
        user_pixartpro_status: '1',
        cx_user_subscriber_status: '0',
        cx_user_subscriber_date_optin: '2023-05-12T07:27:55.634Z',
        user_preferences_analysis: '0',
        user_preferences_analysis_acceptance: '2023-05-12T07:27:55.634Z',
        user_last_login: '2023-05-15T11:09:04Z',
        cx_confirm_items_ordered: 5,
        user_newclient: true,
        cx_user_newclient: false,
      },
      stores: ['gifta', 'pixartprinting'],
      auth: { externalAuth: [], loginMedium: 'PASSWORD' },
      customerGroup: {
        key: 'demo_company',
        id: 'aa329077-9a4c-4e9d-8415-4c390a90fa14',
      },
      registeredFromChannel: {
        id: '325d11f8-be17-4c14-8d8c-4c35bade70f4',
        key: 'gifta.com',
      },
    };

    (customerMapper.toArray as any).mockResolvedValue(expectedResult);
    // Mock fetchCustomerById to return our customer
    jest.spyOn(service, 'fetchCustomerById').mockResolvedValue(customer);
    const result = await service.getCustomerById(customer.id);
    expect(result).toEqual(expectedResult);
    expect(customerMapper.toArray).toHaveBeenCalledWith(customer, expansions);
  });
});
