import { Global, Injectable } from '@nestjs/common';

@Injectable()
export class SmConfigService {
  private awsRegion?: string;
  private awsProfile?: string;
  private appEnv?: string;
  private envConfig?: Record<string, any>;

  getAwsRegion(): string {
    if (!this.awsRegion) throw new Error('AWS SM region not configured.');

    return this.awsRegion;
  }

  getAwsProfile(): string | null {
    return this.awsProfile ?? null;
  }

  getAppEnv(): string {
    if (!this.appEnv) throw new Error('AWS SM AppEnv is not configured');

    return this.appEnv;
  }

  getEnvConfig(): Record<string, any> {
    if (!this.envConfig) throw new Error('AWS SM EnvConfig is not set');

    return this.envConfig;
  }

  setEnvConfig(envConfig: Record<string, any>): void {
    this.envConfig = envConfig;
  }

  configure(config: { region: string; profile?: string; appEnv?: string }) {
    this.awsRegion = config.region;
    this.awsProfile = config.profile;
    this.appEnv = config.appEnv;
  }
}
