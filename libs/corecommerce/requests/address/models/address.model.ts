import { Address, CustomFields } from '@commercetools/platform-sdk';

export class AddressModel implements Address {
  additionalAddressInfo: string;
  additionalStreetInfo: string;
  apartment: string;
  building: string;
  city: string;
  company: string;
  country: string;
  custom: CustomFields;
  department: string;
  email: string;
  externalId: string;
  fax: string;
  firstName: string;
  id: string;
  key: string;
  lastName: string;
  mobile: string;
  pOBox: string;
  phone: string;
  postalCode: string;
  region: string;
  salutation: string;
  state: string;
  streetName: string;
  streetNumber: string;
  title: string;
}
