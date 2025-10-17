export const ADDRESS_CUSTOM_FIELDS_TYPE_KEY = 'addressCustomFields';

export const ADDRESS_CUSTOM_FIELDS_TYPE_ID =
  'c7edb58d-8f6e-4636-987b-10e09f41ce51';

/**
 * Address Standard Fields
 */
export const ADDRESS_STANDARD_FIELDS = {
  id: 'id',
  version: 'version',
  email: 'email',
  key: 'key',
  firstName: 'firstName',
  lastName: 'lastName',
  mobile: 'mobile',
  pOBox: 'pOBox',
  phone: 'phone',
  postalCode: 'postalCode',
  region: 'region',
  salutation: 'salutation',
  state: 'state',
  streetName: 'streetName',
  streetNumber: 'streetNumber',
  title: 'title',
  additionalAddressInfo: 'additionalAddressInfo',
  additionalStreetInfo: 'additionalStreetInfo',
  apartment: 'apartment',
  building: 'building',
  city: 'city',
  company: 'company',
  country: 'country',
  department: 'department',
  fax: 'fax',
  externalId: 'externalId',
  store: 'store',
};

export const INVOICE_CYCLE_PERIOD_ELIGIBLE_CASES = {
  monthly: 'monthly',
  biweekly: 'biweekly',
};

/**
 * Address custom fields
 */
export const ADDRESS_CUSTOM_FIELDS = {
  CF_ISACTIVE: 'isActive',
  CF_INVOICE_CYCLE: 'invoiceCycle',
  CF_PER_BILLING_PROFILE_AUTHORIZED_BY: 'perBillingProfileAuthorizedBy',
  CF_PER_BILLING_PROFILE_AUTHORIZED_TIME: 'perBillingProfileAuthorizedTime',
  CF_TAX_IDS: 'taxIds',
  CF_IS_COMPANY: 'isCompany',
  CF_DEACTIVATION_TIME: 'deactivationTime',
  CF_CREDIT_LIMIT: 'creditLimit',
  CF_CREDIT_LIMIT_AMOUNT: 'creditLimitCentAmount',
  CF_CREDIT_LIMIT_CURRENCY: 'creditLimitCurrency',
  CF_CREATED_AT: 'createdAt',
  CF_LAST_USED_AT: 'lastUsedAt',
  CF_LAST_MODIFIED_AT: 'lastModifiedAt',
  CF_LAST_MODIFIED_BY: 'lastModifiedBy',
  CF_VISIBLE_TO_CHILDREN: 'visibleToChild',
  CF_INVOICES: 'invoices',
  CF_FINALIZE_APPROVAL_REQUIRED: 'finalizeApprovalRequired',
  CF_EXEMPTION_CATEGORIES: 'exemptionCategories',
  CF_PEC: 'pec',
  CF_IPA_CODE: 'ipaCode',
  CF_SDI_CODE: 'sdiCode',
  CF_CREDIT_DAYS: 'creditDays',
  CF_CREDIT_PAYMENT_METHOD: 'creditPaymentMethod',
  CF_IBAN: 'iban',
  CF_ADDITIONAL_COUNTRIES: 'additionalCountries',
  CF_STORE: 'store',
  CF_TAGS: 'tags',
  CF_INVOICE_CYCLE_PERIOD: 'invoiceCyclePeriod',
  CF_BILLINGADDRESS_NACECODE: 'naceCode',
  CF_BILLINGADDRESS_NOTSUBJECTTOVAT: 'notSubjectToVat',
  CF_DQE_VALIDATION_DATE: 'dqeValidationDate',
  CF_EXA_CONNECT_API_KEY: 'exaConnectApiKey',
  CF_DELIVERY_INSTRUCTIONS: 'deliveryInstructions',
};

export const REMOVABLE_ADDRESS_CUSTOM_FIELDS = [
  ADDRESS_CUSTOM_FIELDS.CF_PEC,
  ADDRESS_CUSTOM_FIELDS.CF_IPA_CODE,
  ADDRESS_CUSTOM_FIELDS.CF_SDI_CODE,
];

/**
 * Profile custom fields datatype
 */
export const ADDRESS_CUSTOM_FIELDS_DATATYPE = {
  isActive: 'boolean',
  invoiceCycle: 'string',
  perBillingProfileAuthorizedBy: 'string',
  perBillingProfileAuthorizedTime: 'string',
  taxIds: 'array',
  isCompany: 'boolean',
  deactivationTime: 'string',
  creditLimit: 'string',
  creditLimitCentAmount: 'number',
  creditLimitCurrency: 'string',
  createdAt: 'string',
  lastUsedAt: 'string',
  lastModifiedAt: 'string',
  lastModifiedBy: 'string',
  visibleToChild: 'boolean',
  invoices: 'array',
  finalizeApprovalRequired: 'boolean',
  exemptionCategories: 'array',
  pec: 'string',
  ipaCode: 'string',
  sdiCode: 'string',
  creditDays: 'number',
  creditPaymentMethod: 'string',
  iban: 'string',
  additionalCountries: 'array',
  store: 'string',
  tags: 'array',
  invoiceCyclePeriod: 'string',
  naceCode: 'string',
  notSubjectToVat: 'boolean',
};

export const filterableFields = [
  ADDRESS_STANDARD_FIELDS.id,
  ADDRESS_STANDARD_FIELDS.version,
  ADDRESS_STANDARD_FIELDS.title,
  ADDRESS_STANDARD_FIELDS.salutation,
  ADDRESS_STANDARD_FIELDS.firstName,
  ADDRESS_STANDARD_FIELDS.lastName,
  ADDRESS_STANDARD_FIELDS.streetName,
  ADDRESS_STANDARD_FIELDS.streetNumber,
  ADDRESS_STANDARD_FIELDS.additionalStreetInfo,
  ADDRESS_STANDARD_FIELDS.postalCode,
  ADDRESS_STANDARD_FIELDS.city,
  ADDRESS_STANDARD_FIELDS.region,
  ADDRESS_STANDARD_FIELDS.state,
  ADDRESS_STANDARD_FIELDS.country,
  ADDRESS_STANDARD_FIELDS.company,
  ADDRESS_STANDARD_FIELDS.department,
  ADDRESS_STANDARD_FIELDS.building,
  ADDRESS_STANDARD_FIELDS.apartment,
  ADDRESS_STANDARD_FIELDS.pOBox,
  ADDRESS_STANDARD_FIELDS.phone,
  ADDRESS_STANDARD_FIELDS.mobile,
  ADDRESS_STANDARD_FIELDS.email,
  ADDRESS_STANDARD_FIELDS.fax,
  ADDRESS_STANDARD_FIELDS.externalId,
  ADDRESS_STANDARD_FIELDS.store,
  ADDRESS_CUSTOM_FIELDS.CF_ISACTIVE,
  ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_AMOUNT,
  ADDRESS_CUSTOM_FIELDS.CF_CREDIT_LIMIT_CURRENCY,
  ADDRESS_CUSTOM_FIELDS.CF_INVOICE_CYCLE,
  ADDRESS_CUSTOM_FIELDS.CF_IS_COMPANY,
  ADDRESS_CUSTOM_FIELDS.CF_EXEMPTION_CATEGORIES,
];

export enum InvoiceCyclePeriod {
  Biweekly = 'biweekly',
  Monthly = 'monthly',
  Weekly = 'weekly',
}

export enum CreditPaymentMethod {
  BankTransfer = 'bank-transfer',
  Riba = 'riba',
  Seba = 'seba',
}

export enum InvoiceCycle {
  PerBillingProfile = 'perBillingProfile',
  PerOrder = 'perOrder',
}

export const ADDRESS_TYPES = {
  BILLING: 'billing',
  SHIPPING: 'shipping',
};
