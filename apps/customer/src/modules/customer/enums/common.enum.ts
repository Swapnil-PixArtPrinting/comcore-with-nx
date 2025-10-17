export const CUSTOMER_CUSTOM_FIELDS_KEY = 'customerCustomFields';
export const METADATA_FIELDS = 'PROFILE_METADATA_FIELDS';

/**
 * Expand profile fields
 */
export const CUSTOMER_EXPANDABLES = {
  EXPAND_DETAILED: 'EXPAND_DETAILED',
  EXPAND_INHERIT_ADDRESSES: 'INHERIT_ADDRESSES',
  EXPAND_ADDRESSES: 'EXPAND_ADDRESSES',
  EXPAND_CHILDREN: 'EXPAND_CHILDREN',
  EXPAND_CDP_TRAITS: 'EXPAND_CDP_TRAITS',
  EXPAND_CDP_EVENTS: 'EXPAND_CDP_EVENTS',
  EXPAND_ALL: 'EXPAND_ALL',
  EXPAND_EVENTS: 'EXPAND_EVENTS',
};

/**
 * Customer Standard Fields
 */
export const CUSTOMER_STANDARD_FIELDS = {
  id: 'id',
  version: 'version',
  email: 'email',
  key: 'key',
  customerNumber: 'customerNumber',
  firstName: 'firstName',
  lastName: 'lastName',
  middleName: 'middleName',
  title: 'middleName',
  dateOfBirth: 'dateOfBirth',
  companyName: 'companyName',
  vatId: 'vatId',
  isEmailVerified: 'isEmailVerified',
  customerGroup: 'customerGroup',
  stores: 'stores',
  externalId: 'externalId',
  locale: 'locale',
  createdAt: 'createdAt',
  lastModifiedAt: 'lastModifiedAt',
};

/**
 * Customer custom fields
 */
export const CUSTOMER_CUSTOM_FIELDS = {
  CF_TAGS: 'tags',
  CF_IS_COMPANY: 'isCompany',
  CF_COMPANY_ID: 'companyId',
  CF_COMPANY_ROLE: 'companyRole',
  CF_USER_TYPE: 'userType',
  CF_CUSTOMER_REFERENCE: 'customerReference',
  CF_TENANT: 'tenant',
  CF_REGISTERED_FROM: 'registeredFromStore',
  CF_WALLET_INFO: 'walletInfo',
  CF_CUSTOMER_ISACTIVE: 'isActive',
  CF_CUSTOMER_HASWALLET: 'hasWallet',
  CF_CUSTOMER_ACQUISITION_CHANNEL: 'customerAcquisitionChannel',
  CF_LOGIN_MEDIUM: 'loginMedium',
  CF_PIXART_ACCOUNT_ROLES: 'pixartAccountRoles',
  CF_IS_LARGE_ACCOUNT: 'la_isLargeAccountCustomer',
  CF_USER_BUSINESS_TYPE_ID: 'user_business_type_id',
  CF_USER_COMPANY_SIZE_ID: 'user_company_size_id',
  CF_LEGACYCUSTOMERREFERENCE: 'legacyCustomerReference',
  CF_USER_INDUSTRY_TYPE_ID: 'user_industry_type_id',
  CF_USER_CATEGORY: 'user_category',
  CF_USER_STARWAY: 'user_starway',
  CF_USER_COUNTRY_NAME: 'user_country_name',
  CF_USER_PIXARTPRO_CURRENT_MONTH_AMOUNT: 'user_pixartpro_current_month_amount',
  CF_USER_PIXARTPRO_DATE_FROM: 'user_pixartpro_date_from',
  CF_USER_PIXARTPRO_DATE_TO: 'user_pixartpro_date_to',
  CF_USER_PIXARTPRO_ACTIVATION_REASON: 'user_pixartpro_activation_reason',
  CF_USER_PIXARTPRO_REMOVAL_REASON: 'user_pixartpro_removal_reason',
  CF_USER_PIXARTPRO_STATUS: 'user_pixartpro_status',
  CF_USER_PHONENUMBER: 'user_phonenumber',
  CF_USER_SUBSCRIBER_STATUS: 'user_subscriber_status',
  CF_USER_SUBSCRIBER_DATE_OPTIN: 'user_subscriber_date_optin',
  CF_USER_SUBSCRIBER_DATE_OPTOUT: 'user_subscriber_date_optout',
  CF_CX_USER_SUBSCRIBER_STATUS: 'cx_user_subscriber_status',
  CF_CX_USER_SUBSCRIBER_DATE_OPTIN: 'cx_user_subscriber_date_optin',
  CF_CX_USER_SUBSCRIBER_DATE_OPTOUT: 'cx_user_subscriber_date_optout',
  CF_USER_SUBSCRIBER_CAMPAIGN_ID_OPTOUT: 'user_subscriber_campaign_id_optout',
  CF_USER_PREFERENCES_ANALYSIS: 'user_preferences_analysis',
  CF_USER_PREFERENCES_ANALYSIS_ACCEPTANCE: 'user_preferences_analysis_acceptance',
  CF_USER_PREFERENCES_ANALYSIS_REMOVAL: 'user_preferences_analysis_removal',
  CF_USER_LAST_LOGIN: 'user_last_login',
  CF_USER_MODIFIED_DATE: 'user_modified_date',
  CF_LEGACYCUSTOMERID: 'legacyCustomerId',
  CF_LEGACYCUSTOMERCREATIONDATE: 'legacyCustomerCreationDate',
  CF_USER_PREMIUM_ACTIVATION_REASON: 'user_premium_activation_reason',
  CF_USER_PREMIUM_DATE_FROM: 'user_premium_date_from',
  CF_USER_PREMIUM_DATE_TO: 'user_premium_date_to',
  CF_USER_PREMIUM_STATUS: 'user_premium_status',
  CF_USER_LEGACY_INDUSTRY_TYPE_ID: 'user_legacy_industry_type_id',
  CF_PRINTBOXCUSTOMERID: 'printboxCustomerId',
  CF_LA_ACCOUNTMANAGERNAME: 'la_accountManagerName',
  CF_LA_ACCOUNTMANAGEREMAIL: 'la_accountManagerEmail',
  CF_LA_ACCOUNTMANAGERINITIALDATE: 'la_accountManagerInitialDate',
  CF_LA_PROMOCODEEXPIRYDATE: 'la_promocodeExpiryDate',
  CF_CONFIRM_ITEMS_ORDERED: 'confirm_items_ordered',
  CF_CX_CONFIRM_ITEMS_ORDERED: 'cx_confirm_items_ordered',
  CF_USER_NEWCLIENT: 'user_newclient',
  CF_CX_USER_NEWCLIENT: 'cx_user_newclient',
  CF_TESTACCOUNT: 'testAccount',
  CF_DECLINEDSEGMENT: 'declinedSegment',
  CF_ISSAMPLEACCOUNT: 'isSampleAccount',
  CF_LOGINMEDIUM: 'loginMedium',
  CF_CUSTOMERSEGMENT: 'customerSegment',
  CF_CUSTOMERSEGMENT2: 'customerSegment2',
  CF_COMMERCIALAGREEMENT: 'commercialAgreement',
  CF_CUSTOMERS_REFERENCE: 'customersReference',
  CF_EXTERNAL_AUTH: 'externalAuth',
};

/**
 * Profile custom fields datatype
 */
export const CUSTOMER_CUSTOM_FIELDS_DATATYPE = {
  tags: 'array',
  isCompany: 'boolean',
  companyId: 'json',
  customerReference: 'string',
  tenant: 'string',
  registeredFromStore: 'json',
  walletInfo: 'string',
  isActive: 'boolean',
  hasWallet: 'boolean',
  customerAcquisitionChannel: 'string',
  loginMedium: 'string',
  pixartAccountRoles: 'array',
  la_isLargeAccountCustomer: 'boolean',
  user_business_type_id: 'string',
  user_company_size_id: 'string',
  legacyCustomerReference: 'string',
  user_industry_type_id: 'string',
  user_category: 'string',
  user_starway: 'string',
  user_country_name: 'string',
  user_pixartpro_current_month_amount: 'number',
  user_pixartpro_date_from: 'datetime',
  user_pixartpro_date_to: 'datetime',
  user_pixartpro_activation_reason: 'string',
  user_pixartpro_removal_reason: 'string',
  user_pixartpro_status: 'string',
  user_phonenumber: 'string',
  user_subscriber_status: 'string',
  user_subscriber_date_optin: 'datetime',
  user_subscriber_date_optout: 'datetime',
  cx_user_subscriber_status: 'string',
  cx_user_subscriber_date_optin: 'datetime',
  cx_user_subscriber_date_optout: 'datetime',
  user_subscriber_campaign_id_optout: 'string',
  user_preferences_analysis: 'string',
  user_preferences_analysis_acceptance: 'datetime',
  user_preferences_analysis_removal: 'datetime',
  user_last_login: 'datetime',
  user_modified_date: 'datetime',
  legacyCustomerId: 'string',
  legacyCustomerCreationDate: 'datetime',
  user_premium_activation_reason: 'string',
  user_premium_date_from: 'datetime',
  user_premium_date_to: 'datetime',
  user_premium_status: 'string',
  user_legacy_industry_type_id: 'string',
  printboxCustomerId: 'string',
  la_accountManagerName: 'string',
  la_accountManagerEmail: 'string',
  la_accountManagerInitialDate: 'datetime',
  la_promocodeExpiryDate: 'datetime',
  confirm_items_ordered: 'number',
  cx_confirm_items_ordered: 'number',
  user_newclient: 'boolean',
  cx_user_newclient: 'boolean',
  testAccount: 'boolean',
  declinedSegment: 'string',
  isSampleAccount: 'boolean',
  customerSegment: 'string',
  customerSegment2: 'string',
  commercialAgreement: 'string',
  customersReference: 'json',
  externalAuth: 'json',
};

/**
 * Customer metadata fields
 */
export const CUSTOMER_METADATA_FIELDS = {
  CF_USER_BUSINESS_TYPE_ID: 'user_business_type_id',
  CF_USER_COMPANY_SIZE_ID: 'user_company_size_id',
  CF_LEGACYCUSTOMERREFERENCE: 'legacyCustomerReference',
  CF_USER_INDUSTRY_TYPE_ID: 'user_industry_type_id',
  CF_USER_CATEGORY: 'user_category',
  CF_USER_STARWAY: 'user_starway',
  CF_USER_COUNTRY_NAME: 'user_country_name',
  CF_USER_PIXARTPRO_CURRENT_MONTH_AMOUNT: 'user_pixartpro_current_month_amount',
  CF_USER_PIXARTPRO_DATE_FROM: 'user_pixartpro_date_from',
  CF_USER_PIXARTPRO_DATE_TO: 'user_pixartpro_date_to',
  CF_USER_PIXARTPRO_ACTIVATION_REASON: 'user_pixartpro_activation_reason',
  CF_USER_PIXARTPRO_REMOVAL_REASON: 'user_pixartpro_removal_reason',
  CF_USER_PIXARTPRO_STATUS: 'user_pixartpro_status',
  CF_USER_PHONENUMBER: 'user_phonenumber',
  CF_USER_SUBSCRIBER_STATUS: 'user_subscriber_status',
  CF_USER_SUBSCRIBER_DATE_OPTIN: 'user_subscriber_date_optin',
  CF_USER_SUBSCRIBER_DATE_OPTOUT: 'user_subscriber_date_optout',
  CF_CX_USER_SUBSCRIBER_STATUS: 'cx_user_subscriber_status',
  CF_CX_USER_SUBSCRIBER_DATE_OPTIN: 'cx_user_subscriber_date_optin',
  CF_CX_USER_SUBSCRIBER_DATE_OPTOUT: 'cx_user_subscriber_date_optout',
  CF_USER_SUBSCRIBER_CAMPAIGN_ID_OPTOUT: 'user_subscriber_campaign_id_optout',
  CF_USER_PREFERENCES_ANALYSIS: 'user_preferences_analysis',
  CF_USER_PREFERENCES_ANALYSIS_ACCEPTANCE: 'user_preferences_analysis_acceptance',
  CF_USER_PREFERENCES_ANALYSIS_REMOVAL: 'user_preferences_analysis_removal',
  CF_USER_LAST_LOGIN: 'user_last_login',
  CF_USER_MODIFIED_DATE: 'user_modified_date',
  CF_LEGACYCUSTOMERID: 'legacyCustomerId',
  CF_LEGACYCUSTOMERCREATIONDATE: 'legacyCustomerCreationDate',
  CF_ISACTIVE: 'isActive',
  CF_USER_PREMIUM_ACTIVATION_REASON: 'user_premium_activation_reason',
  CF_USER_PREMIUM_DATE_FROM: 'user_premium_date_from',
  CF_USER_PREMIUM_DATE_TO: 'user_premium_date_to',
  CF_USER_PREMIUM_STATUS: 'user_premium_status',
  CF_USER_LEGACY_INDUSTRY_TYPE_ID: 'user_legacy_industry_type_id',
  CF_PRINTBOXCUSTOMERID: 'printboxCustomerId',
  CF_LA_ACCOUNTMANAGERNAME: 'la_accountManagerName',
  CF_LA_ACCOUNTMANAGEREMAIL: 'la_accountManagerEmail',
  CF_LA_ACCOUNTMANAGERINITIALDATE: 'la_accountManagerInitialDate',
  CF_LA_PROMOCODEEXPIRYDATE: 'la_promocodeExpiryDate',
  CF_CONFIRM_ITEMS_ORDERED: 'confirm_items_ordered',
};

/**
 * Customer metadata fields readonly
 */
export const CUSTOMER_METADATA_FIELDS_READONLY = {
  CF_CX_CONFIRM_ITEMS_ORDERED: 'cx_confirm_items_ordered',
  CF_USER_NEWCLIENT: 'user_newclient',
  CF_CX_USER_NEWCLIENT: 'cx_user_newclient',
  CF_TESTACCOUNT: 'testAccount',
  CF_DECLINEDSEGMENT: 'declinedSegment',
  CF_ISSAMPLEACCOUNT: 'isSampleAccount',
  CF_LOGINMEDIUM: 'loginMedium',
  CF_CUSTOMERSEGMENT: 'customerSegment',
  CF_CUSTOMERSEGMENT2: 'customerSegment2',
  CF_COMMERCIALAGREEMENT: 'commercialAgreement',
};

/**
 * Profile Login Mediums
 */
export enum LOGIN_MEDIUM {
  PASSWORD = 'PASSWORD',
  EXTERNAL = 'EXTERNAL',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

export enum PROFILE_USER_TYPE {
  MASTER = 'Customer',
  CHILD = 'Account',
}

/**
 * Profile Types
 */
export enum PROFILE_TYPE {
  MASTER = 'MASTER',
  CHILD = 'CHILD',
  DEFAULT = 'DEFAULT',
}
