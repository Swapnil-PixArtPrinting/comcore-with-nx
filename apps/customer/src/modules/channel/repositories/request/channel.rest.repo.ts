import { Injectable } from '@nestjs/common';
import { IChannelRepository } from '../channel.repositories.interface';
import {
  ChannelModel,
  CommerceChannelServiceFactory,
} from '@comcore/ocs-lib-corecommerce';

@Injectable()
export class ChannelRestRepository implements IChannelRepository {
  constructor(
    private readonly commerceChannelService: CommerceChannelServiceFactory,
  ) {}

  /**
   *
   * @param channelKey
   */
  async fetchChannelByKey(channelKey: string): Promise<ChannelModel | null> {
    return await this.commerceChannelService.service.fetchChannelByKey(
      channelKey,
    );
  }

  async getKeyById(channelId: string): Promise<string> {
    return await this.commerceChannelService.service.getKeyById(channelId);
  }
}
