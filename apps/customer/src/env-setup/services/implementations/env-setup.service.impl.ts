import { IEnvSetupService } from '../env-setup.service.interface';
import { Inject } from '@nestjs/common';
import { ENV_CONFIG_SERVICE } from '../../../../../../libs/common/src';
import type { IEnvConfigService } from '../../../../../../libs/common/src';
import {
  SECRETS_MANAGER_SERVICE,
  SmConfigService,
} from '../../../../../../libs/aws/src';
import type {
  ISecretsManagerServiceInterface,
} from '../../../../../../libs/aws/src';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'node:path';

export class EnvSetupServiceImpl implements IEnvSetupService {
  private FILENAME_AWS_PARAMETERS_TEMPLATE = '.env.parameterstore';
  private FILENAME_DEFAULT_ENV = '.env';

  /**
   * @param envConfigService - to get env details from config for each workspace
   * @param smConfigService - to store the data like aws region, customer
   * @param secretsManagerService - to get data from AWS Secrets Manager and Parameter store
   * @param configService - to get data from .env file
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly smConfigService: SmConfigService,
    @Inject(ENV_CONFIG_SERVICE)
    private readonly envConfigService: IEnvConfigService,
    @Inject(SECRETS_MANAGER_SERVICE)
    private readonly secretsManagerService: ISecretsManagerServiceInterface,
  ) {
    // save the aws region and profile in the secret managers config service
    this.smConfigService.configure({
      region: this.configService.get('AWS_SNS_REGION') ?? 'eu-west-1',
      appEnv: this.configService.get('APP_ENV'),
    });
  }

  /**
   * Substitute the parameters in the content with the values from the params object
   * @param content
   * @param params
   * @private
   */
  private substituteParams(content: string, params: Record<string, string>): string {
    for (const key in params) {
      content = content.replace(new RegExp(`%%${key}%%`, 'g'), params[key]);
    }
    return content;
  }

  /**
   * Get the dynamic env variables like APP_URL which will change based on environment
   * @private
   */
  private async getDynamicEnvVariables() {
    let dynamicEnvVariables = '';
    const appEnv = this.configService.get('APP_ENV') || '';
    const appBranchName = this.configService.get('APP_BRANCH_NAME') || 'master';

    const envVariables = await this.envConfigService.fetchEnvVariables('customer');

    // Set the app URL based on the app environment
    let appUrl: string;

    if (appEnv === 'local') {
      appUrl = envVariables?.[appEnv].APP_URL || '';
    } else if (appEnv === 'production' && appBranchName === 'master') {
      appUrl = envVariables?.[appEnv].APP_URL || '';
    } else {
      appUrl = `https://${appEnv}-customer-${appBranchName
        .replace(/[^A-Za-z0-9\-]/g, '')
        .replace(/\//g, '-')
        .toLowerCase()
        .substring(0, 24)}.india.pixartprinting.net`;
    }

    dynamicEnvVariables += `APP_URL=${appUrl}\n`;
    return dynamicEnvVariables;
  }

  /**
   * Create the .env file with the parameters from the params object
   * @param params
   * @param testFile
   */
  public async createEnvFile(params: Record<string, string>, testFile?: string): Promise<boolean> {
    const basePath = path.resolve(__dirname, '../../../../');
    const filePathEnv: string = path.join(basePath, '.env');

    const defaultFiles: Record<string, string> = {
      production: path.join(basePath, '.env.defaults.production'),
      quality: path.join(basePath, '.env.defaults.quality'),
      staging: path.join(basePath, '.env.defaults.staging'),
      local: path.join(basePath, '.env.defaults.local'),
      testing: path.join(basePath, '.env.defaults.testing'),
    };

    const parameterStoreFile = path.join(basePath, this.FILENAME_AWS_PARAMETERS_TEMPLATE);
    const envOutputFile = testFile ?? path.join(basePath, this.FILENAME_DEFAULT_ENV);

    // Check if parameter store file exists
    try {
      await fs.access(parameterStoreFile);
    } catch {
      throw new Error('Parameter store env config file not found');
    }

    // Read the parameter store file and substitute the parameters with the values from the params object
    let parameterStoreFileContents = await fs.readFile(parameterStoreFile, 'utf8');
    parameterStoreFileContents = this.substituteParams(parameterStoreFileContents, params);

    let returnStatus = true;
    const defaultFile = defaultFiles[this.configService.get('APP_ENV')];

    // Read the default env file based on the app environment
    let defaultFileContents = '';
    try {
      defaultFileContents = await fs.readFile(defaultFile, 'utf8');
    } catch {
      console.warn(`Default env config file: ${defaultFile} not found`);
    }

    // get the dynamic env varibales like APP_URL which will change based on environment
    const awsPersonalCredentials = await this.getDynamicEnvVariables();

    // Combine the AWS personal credentials, default env file contents and parameter store file contents
    const finalContent =
      awsPersonalCredentials + '\n' + defaultFileContents + '\n' + parameterStoreFileContents;

    // Delete the .env file if it exists
    try {
      await fs.unlink(filePathEnv); // Deletes the .env file if it exists
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error deleting .env file:', err);
      }
    }

    // Write the final content to the .env file
    try {
      await fs.writeFile(envOutputFile, finalContent, 'utf8');
    } catch {
      returnStatus = false;
    }

    return returnStatus;
  }

  /**
   * Generate the .env file and get the data from parameter store and secret manager
   */
  public async generateEnvFile() {
    // Fetch the env details from the config for service
    const envConfig = await this.envConfigService.fetchEnvDetails('customer');

    // Save the env details in the secret manager config service
    this.smConfigService.setEnvConfig(envConfig);

    // Get the parameters from the parameter store
    let parametersArray = await this.secretsManagerService.getParams(envConfig['base-path']);

    // Fetch the data from the secrets manager
    parametersArray = {
      ...parametersArray,
      ...(await this.secretsManagerService.fetchSecretManagerData('all')),
      ...(await this.secretsManagerService.fetchSecretManagerData(
        this.configService.get('APP_ENV'),
      )),
    };

    // Create the .env file with the parameters
    const status = await this.createEnvFile(parametersArray);

    // Log the status of the .env file creation
    if (status) {
      console.log('Env file created successfully');
    } else {
      console.log('Error creating env file');
    }
  }
}
