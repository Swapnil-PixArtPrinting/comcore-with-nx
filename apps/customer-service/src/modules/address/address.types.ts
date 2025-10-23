import {
  ADDRESS_TYPES,
  CreditPaymentMethod,
  InvoiceCycle,
  InvoiceCyclePeriod,
} from './address.enum';

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  region: string;
  state: string;
  country: string;
  company: string;
  phone: string;
  email: string;
  key: string;
  invoices: {
    typeId: string;
    id: string;
  };
  invoiceCyclePeriod: InvoiceCyclePeriod;
  perBillingProfileAuthorizedBy: string;
  creditPaymentMethod: CreditPaymentMethod;
  creditDays: number;
  isCompany: boolean;
  sdiCode: string;
  ipaCode: string;
  lastModifiedAt: Date;
  perBillingProfileAuthorizedTime: Date;
  taxIds: {
    vatid: string;
    VAT: string;
    codiceFiscale: string;
  };
  creditLimitCurrency: string;
  creditLimitCentAmount: number;
  visibleToChild: boolean;
  invoiceCycle: InvoiceCycle;
  pec: string;
  createdAt: Date;
  isActive: boolean;
  isDefault: boolean;
}

export interface Invoices {
  typeId: string;
  id: string;
}

export type AddressType = (typeof ADDRESS_TYPES)[keyof typeof ADDRESS_TYPES];
