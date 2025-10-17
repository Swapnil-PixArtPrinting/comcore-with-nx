import { Address } from "../../address/address.types";


export interface Customer {
  id: string;
  customerNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: Date;
  externalId: string;
  locale: string;
  tags: string[];
  registeredFromStore: RegisteredFromStore;
  isActive: boolean;
  testAccount: boolean;
  addresses: Addresses;
  companyName: string;
  businessData: BusinessData;
  mlam: Mlam;
  stores: string[];
  auth: Auth;
  customerGroup: ResourceIdentity;
  registeredFromChannel: ResourceIdentity;
}

export interface Addresses {
  billing: AddressStructure;
  shipping: AddressStructure;
  defaultBillingAddressId: string;
  defaultShippingAddressId: string;
}

export interface AddressStructure {
  [key: string]: Address;
}

export interface Mlam {
  immediateParentId: string | null;
  nodeType: string;
  childrens: string[];
  companyRole: string | null;
  key: string;
}

interface BusinessData {
  [key: string]: string | boolean | number | Date | null | Record<string, any>;
}

export interface ResourceIdentity {
  key: string;
  id: string;
}

interface Auth {
  externalAuth: ExternalAuth[];
  loginMedium: string;
}

interface ExternalAuth {
  platform: string;
  createdAt: Date;
  uniqueId: string;
  store: string;
}

export interface RegisteredFromStore {
  [StoreName: string]: Date;
}

export enum NodeType {
  ROOT = 'root',
  BRANCH = 'branch',
  LEAF = 'leaf',
  DEFAULT = 'default',
}
