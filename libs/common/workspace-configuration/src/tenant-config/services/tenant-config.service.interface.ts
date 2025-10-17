export const TENANT_CONFIG_SERVICE = "TENANT_CONFIG_SERVICE";

export interface ITenantConfigService {
    /**
     *
     * @param workspaceName
     * @param key
     * @param store
     * @param tenantId
     */
    get(workspaceName: string, key: string, store?: string, tenantId?: string)

    /**
     *
     * @param workspaceName
     * @param store
     * @param tenantId
     */
    getTenantConfig(workspaceName: string, store?: string, tenantId?: string)

    /**
     *
     */
    getCimpressAuth()
}