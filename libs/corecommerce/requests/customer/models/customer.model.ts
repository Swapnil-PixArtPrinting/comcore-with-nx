import {
    Address,
    CustomFields,
    CustomerGroupReference,
    StoreKeyReference,
} from "@commercetools/platform-sdk";
import { BaseModel } from '../../../interfaces/base-model.interface';

export interface CustomerModel extends BaseModel {
    key?: string;
    customerNumber?: string;
    externalId?: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    title?: string;
    dateOfBirth?: string;
    companyName?: string;
    vatId?: string;
    addresses: Address[];
    defaultShippingAddressId?: string;
    shippingAddressIds?: string[];
    defaultBillingAddressId?: string;
    billingAddressIds?: string[];
    isEmailVerified: boolean;
    customerGroup?: CustomerGroupReference;
    custom?: CustomFields;
    locale?: string;
    salutation?: string;
    stores: StoreKeyReference[];
    authenticationMode: string;
}