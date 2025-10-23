/**
 * @file - EnvSetupServiceInterface - Service Interface for ENV Setup
 */

export const ENV_SETUP_SERVICE = 'ENV_SETUP_SERVICE';

export interface IEnvSetupService {
  /**
   * @description - Method to generate the env file
   */
  generateEnvFile(): any;
}
