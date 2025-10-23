import { Injectable } from '@nestjs/common';

@Injectable()
export class SnsConfigService {
  private awsSNSRegion?: string;
  private awsTopicARN?: string;
  private awsProfile?: string;

  getAwsSnsRegion(): string {
    if (!this.awsSNSRegion) throw new Error('AWS SNS region not configured.');

    return this.awsSNSRegion;
  }

  getAwsTopicARN(): string {
    if (!this.awsTopicARN)
      throw new Error('AWS SNS Topic ARN is not configured');

    return this.awsTopicARN;
  }

  getAwsProfile(): string | null {
    return this.awsProfile ?? null;
  }

  configure(config: { region: string; topicARN: string; profile?: string }) {
    this.awsSNSRegion = config.region;
    this.awsTopicARN = config.topicARN;
    this.awsProfile = config.profile;
  }
}
