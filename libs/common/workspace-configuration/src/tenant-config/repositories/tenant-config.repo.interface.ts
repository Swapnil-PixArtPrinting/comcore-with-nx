export const TENANT_CONFIG_REPO = 'TENANT_CONFIG_REPO';

export interface ITenantConfigRepo {
  /**
   *
   * @param workspaceName
   * @param store
   * @param tenant
   */
  fetchTenantDetails(workspaceName: string, store: string, tenant: string);

  /**
   *
   */
  getCimpressAuth();
}
