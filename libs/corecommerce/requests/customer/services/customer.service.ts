import {
    Customer,
    CustomerReference,
    CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { CustomerGroupModel } from "../../core-customer-group";
import { CustomerModel } from "../models";
import { CoreRegisterCustomerDTO } from "../dto";

export const COMMERCE_CUSTOMER_SERVICE = "COMMERCE_CUSTOMER_SERVICE";

export interface CommerceCustomerService {
    /**
     * 
     * @param customerEmail 
     */
    fetchCustomerByEmail(customerEmail: string): Promise<any>;

    /**
     *
     * @param customerId
     */
    fetchCustomerById(customerId: string): Promise<CustomerModel | null>;

    /**
     *
     * @param customer
     * @param actions
     */
    updateAllCustomerActions(customer: Customer, actions: Array<CustomerUpdateAction>): Promise<any>;


    /**
     * 
     * @param email 
     * @param password 
     */
    setPassword(email: string, password: string): Promise<any>;

    /**
     * 
     * @param customer 
     * @param customerGroup 
     * @param execute 
     */
    changeGroup(customer: CustomerModel, customerGroup?: CustomerGroupModel, execute?: boolean): Promise<any>;

    /**
     * 
     * @param customer 
     * @param fieldName 
     * @param fieldValue 
     * @param execute 
     */
    setCustomField(customer: CustomerModel, fieldName: string, fieldValue: any, execute?: boolean): Promise<any>

    /**
     * 
     * @param customerDraft 
     */
    createCustomerFromDraft(customerDraft: CoreRegisterCustomerDTO): Promise<any>

    /**
     *
     * @param customer
     * @param storeKey
     * @param execute
     */
    addStore(customer: CustomerModel, storeKey: string, execute: boolean): Promise<any>

    /**
     * 
     * @param customer 
     * @param companyName 
     * @param execute 
     */
    changeCompanyName(customer: CustomerModel, companyName?: string, execute?: boolean): Promise<any>

    /**
     * 
     * @param customer 
     * @param vatId 
     * @param execute 
     */
    changeVatId(customer: CustomerModel, vatId?: string, execute?: boolean): Promise<any>

    /**
     *
     * @param customerId
     */
    getCustomerReference(customerId: string): CustomerReference

    /**
     *
     * @param customer
     * @param key
     * @param execute
     */
    setKey(customer: CustomerModel, key: string, execute?: boolean): Promise<CustomerModel | CustomerUpdateAction>

    /**
     *
     * @param customer
     * @param newEmail
     * @param execute
     */
    changeEmail(customer: CustomerModel, newEmail: string, execute?: boolean): Promise<CustomerModel | CustomerUpdateAction>
}