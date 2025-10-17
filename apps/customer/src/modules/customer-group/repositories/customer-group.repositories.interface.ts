export const CUSTOMER_GROUP_REPOSITORY = 'CUSTOMER_GROUP_REPOSITORY';

export interface ICustomerGroupRepository {
  /**
   *
   * @param string
   */
  fetchGroupUsingKey(string);
}
