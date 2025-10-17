import { Inject, Injectable } from '@nestjs/common';
import { EVENT_SOURCE, VAL_VERSION, VALID_EVENTS } from '../constants/event.constants';
import { v4 as uuidv4 } from 'uuid';
import { IEvent, IMessageAttribute } from '../interfaces/event.interface';
import { isEmpty } from 'class-validator';
import { SNS_SERVICE, SnsConfigService, ISnsServiceInterface } from '@comcore/ocs-aws-kit';
import { ConfigService } from '@nestjs/config';
import { WorkspaceService } from '@comcore/ocs-lib-common';

export const EVENT_PUBLISHER_SERVICE = 'EVENT_PUBLISHER_SERVICE';

@Injectable()
export class EventPublisherService {
  constructor(
    @Inject(SNS_SERVICE)
    private readonly snsService: ISnsServiceInterface,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private readonly snsConfigService: SnsConfigService,
    private readonly workspaceService: WorkspaceService,
  ) {
    this.snsConfigService.configure({
      region: this.configService.get('AWS_SNS_REGION'),
      topicARN: this.configService.get('AWS_SNS_ARN'),
    });
  }
  /**
   *
   * @param tenantId
   * @param eventName
   * @param resource
   * @param customerGroup
   * @param metadata
   * @param callerType
   * @param eventNature
   * @param stores
   * @param eventId
   */
  async publish(
    tenantId: string,
    eventName: string,
    resource: any,
    customerGroup?: string,
    metadata: any = [],
    callerType: string = '',
    eventNature: string = 'natural',
    stores: any[] = [],
    eventId: string = null,
  ): Promise<void> {
    if (!(await this.validate(eventName))) {
      throw new Error('Invalid event');
    }

    const workspaceName = this.workspaceService.getWorkspace();

    const currentTimeStamp = Date.now();
    eventId = eventId ? eventId : uuidv4().toString();

    let streamId;
    if (resource?.id) {
      streamId = resource.id;
    } else if (metadata?.customerId) {
      streamId = metadata.customerId;
    } else {
      streamId = uuidv4();
    }

    const eventArray: IEvent = {
      id: eventId,
      streamId: streamId,
      eventChainIds: [],
      customerGroup: customerGroup,
      tenantId: tenantId,
      eventType: eventName,
      issuedAt: new Date().toISOString(),
      caller: callerType,
      type: eventName,
      source: EVENT_SOURCE,
      nature: eventNature,
      version: VAL_VERSION,
      emittedAt: {
        timestamp: currentTimeStamp.toString(),
        readable: new Date(currentTimeStamp).toISOString(),
      },
      payload: {
        resource: resource,
        metadata: metadata,
      },
    };

    const messageAttributes: IMessageAttribute = {
      workspace: {
        DataType: 'String',
        StringValue: workspaceName,
      },
      Subject: {
        DataType: 'String',
        StringValue: eventName,
      },
      tenantId: {
        DataType: 'String',
        StringValue: tenantId,
      },
    };

    if (!isEmpty(customerGroup)) {
      messageAttributes['customerGroup'] = {
        DataType: 'String',
        StringValue: customerGroup,
      };
    }

    if (Array.isArray(stores) && stores.length > 0) {
      messageAttributes['stores'] = {
        DataType: 'String',
        StringValue: JSON.stringify(Object.values(stores)),
      };
    }

    if (this.configService.get('environment') != 'local') {
      await this.snsService.publish(JSON.stringify(eventArray), eventName, messageAttributes);
    }
  }

  async validate(eventName: string): Promise<boolean> {
    return VALID_EVENTS.includes(eventName);
  }
}
