export const ENV_CONFIG_REPO = 'ENV_CONFIG_REPO';

export interface IEnvConfigRepoInterface {
  /**
   *
   * @param resource
   */
  fetchEnvDetails(resource: string);

  /**
   *
   * @param environment
   */
  fetchEnvVariables(environment: string);
}
