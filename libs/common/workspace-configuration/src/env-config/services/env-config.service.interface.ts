export const ENV_CONFIG_SERVICE = "ENV_CONFIG_SERVICE";

export interface IEnvConfigService {
    /**
     *
     * @param resource
     */
    fetchEnvDetails(resource: string)

    /**
     *
     * @param environment
     */
    fetchEnvVariables(environment: string)
}