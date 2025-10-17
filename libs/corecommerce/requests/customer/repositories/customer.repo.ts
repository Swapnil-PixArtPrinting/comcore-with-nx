import { Customer, CustomerUpdateAction } from "@commercetools/platform-sdk";
import { CoreRegisterCustomerDTO } from "../dto";
import { CustomerModel } from '../models/customer.model';

export const COMMERCE_CUSTOMER_REPOSITORY = "COMMERCE_CUSTOMER_REPOSITORY";

export interface CommerceCustomerRepository {
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
     * @param ttlMinutes 
     */
    generatePasswordResetToken(email: string, ttlMinutes: number): Promise<any>;

    /**
     * 
     * @param email 
     * @param password 
     */
    setPassword(email: string, password: string): Promise<any>;

    /**
     * 
     * @param customerDraft 
     */
    createCustomerFromDraft(customerDraft: CoreRegisterCustomerDTO): Promise<any>;
}