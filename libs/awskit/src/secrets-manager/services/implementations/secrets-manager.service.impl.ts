import { Inject } from '@nestjs/common';
import { SmClientBuilder } from '../../client';
import { SmConfigService } from '../../config';
import { ISecretsManagerServiceInterface } from '../secrets-manager.service.interface';
import { GetParametersByPathCommand } from '@aws-sdk/client-ssm';
import {
  BatchGetSecretValueCommand,
  FilterNameStringType,
} from '@aws-sdk/client-secrets-manager';

export class SecretsManagerServiceImpl
  implements ISecretsManagerServiceInterface
{
  constructor(
    @Inject(SmConfigService)
    private readonly smConfigService: SmConfigService,
    @Inject(SmClientBuilder)
    private readonly smClientBuilder: SmClientBuilder,
  ) {}

  /**
   *
   * @param path
   */
  async getParams(path: string) {
    return {
      ...(await this.fetchParams(path, 'all')),
      ...(await this.fetchParams(path, this.smConfigService.getAppEnv())),
    };
  }

  /**
   *
   * @param appPath
   * @param env
   */
  async fetchParams(appPath: string, env: string = 'all') {
    const params = {};

    if (!env) {
      return params;
    }

    const path = `/${[appPath.trim().replace(/^\/|\/$/g, ''), env.trim().replace(/^\/|\/$/g, '')].join('/')}/`;
    console.log(`Fetching path: ${path}`);

    let nextToken = undefined;
    do {
      const req = {
        ParameterFilters: [
          {
            Key: 'tag:AllInPath', // REQUIRED
          },
        ],
        Path: path,
        NextToken: nextToken,
        Recursive: true,
        WithDecryption: true,
      };

      const command = new GetParametersByPathCommand(req);
      const response = await this.smClientBuilder.getSsmClient().send(command);

      for (const item of response.Parameters) {
        // Remove prefix from name and eventually substitute additional / with _
        const idx = this.normalizeParameterName(path, item.Name);
        params[idx] = item.Value;
      }
      nextToken = response.NextToken;
    } while (nextToken);

    return params;
  }

  async fetchSecretManagerData(env: string = 'all') {
    const params = {};

    const envConfig = this.smConfigService.getEnvConfig();
    const secretManagerClient = envConfig?.['secret-manager'];
    const baseSecretName = secretManagerClient['base-name'];
    const secretNames = secretManagerClient['secret-names'];

    const awsSecretNames: string[] = secretNames.map((secretName) =>
      [baseSecretName.trim(), env.trim(), secretName.trim()].join('/'),
    );

    if (awsSecretNames.length == 0) {
      return params;
    }

    console.log(
      `Fetching secret manager names: ${JSON.stringify(awsSecretNames)}`,
    );

    let nextToken = null;
    do {
      const req: any = {
        Filters: [
          {
            Key: 'name' as FilterNameStringType, // Ensure it's a valid enum/type value
            Values: awsSecretNames,
          },
        ],
      };

      if (nextToken) {
        req['NextToken'] = nextToken;
      }

      const command = new BatchGetSecretValueCommand(req);
      const response = await this.smClientBuilder
        .getSecretManagersClient()
        .send(command);
      const secretValues = response.SecretValues;
      if (secretValues && secretValues.length > 0) {
        for (const secretValue of secretValues) {
          if (secretValue.SecretString) {
            try {
              const resultSecretString = JSON.parse(secretValue.SecretString);
              Object.assign(params, resultSecretString);
            } catch (error) {
              console.error('Error parsing secret JSON:', error);
            }
          }
        }
      }

      nextToken = response.NextToken;
    } while (nextToken);

    return params;
  }

  normalizeParameterName(path: string, name: string): string {
    // Remove prefix from name and substitute additional / with _
    // Convert all to uppercase
    return name
      .replace(path, '') // Remove path prefix
      .trim() // Trim whitespace
      .replace(/[^0-9a-z]/gi, '_') // Replace non-alphanumeric characters with _
      .toUpperCase(); // Convert to uppercase
  }
}
