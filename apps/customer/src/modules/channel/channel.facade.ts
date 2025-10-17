import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheService } from '@comcore/ocs-lib-common';
import { ChannelRepositoryFactory } from './providers/channel.repo.provider';

const CHANNEL_CACHE_PREFIX = 'customerGroup';

@Injectable()
export class ChannelFacade {
  constructor(
    @Inject(RedisCacheService)
    private readonly redisCacheService: RedisCacheService,
    private readonly channelRepositoryFactory: ChannelRepositoryFactory,
  ) {}

  /**
   *
   * @param channelKey
   */
  async fetchChannelByKey(channelKey: string) {
    let channel = await this.redisCacheService.get(
      CHANNEL_CACHE_PREFIX + '_' + channelKey,
    );
    if (channel) {
      return channel;
    }

    channel =
      await this.channelRepositoryFactory.repository.fetchChannelByKey(
        channelKey,
      );
    await this.redisCacheService.set(
      CHANNEL_CACHE_PREFIX + '_' + channelKey,
      channel,
      1000 * 60 * 5,
    );
    return channel;
  }
}
