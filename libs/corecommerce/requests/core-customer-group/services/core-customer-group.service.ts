export const COMMERCE_CUSTOMER_GROUP_SERVICE = "COMMERCE_CUSTOMER_GROUP_SERVICE";

export interface CommerceCustomerGroupService {
    /**
     * 
     * @param customerGroupKey 
     */
    fetchCustomerGroupByKey(customerGroupKey: string): Promise<any>
}