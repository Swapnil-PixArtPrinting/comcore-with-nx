export const COMMERCE_CUSTOMER_GROUP_REPOSITORY = "COMMERCE_CUSTOMER_GROUP_REPOSITORY";

export interface CommerceCustomerGroupRepository {
    /**
     * 
     * @param customerGroupKey 
     */
    fetchCustomerGroupByKey(customerGroupKey: string): Promise<any>
}