import { Inject, Injectable } from '@nestjs/common';
import { ISnsServiceInterface } from '../sns.services.interface';
import { SnsConfigService } from '../../config';
import { SnsClientBuilder } from '../../client';
import { PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class SnsServiceImpl implements ISnsServiceInterface {
  constructor(
    @Inject(SnsConfigService)
    private readonly snsConfigService: SnsConfigService,
    @Inject(SnsClientBuilder)
    private readonly snsClientBuilder: SnsClientBuilder,
  ) {}

  async publish(
    messageData: string,
    messageSubject: string,
    messageAttributes: any,
  ) {
    let topicArn: string;

    try {
      topicArn = this.snsConfigService.getAwsTopicARN();
    } catch (configError) {
      throw configError;
    }

    const params = {
      TopicArn: topicArn,
      Subject: messageSubject,
      Message: messageData,
      MessageAttributes: messageAttributes,
    };

    let client = this.snsClientBuilder.getSnsClient();
    const command = new PublishCommand(params);

    try {
      await client.send(command);
    } catch (error: any) {
      // Check for expired token error (e.g., credentials expired)
      const isExpired =
        error?.name === 'ExpiredToken' ||
        error?.message?.includes('expired') ||
        error?.message?.includes('could not be loaded');

      if (isExpired) {
        console.warn('AWS credentials expired. Refreshing SNS client...');
        client = this.snsClientBuilder.refreshClient();
        await client.send(command);
      } else {
        throw error; // rethrow other errors
      }
    }
  }
}
