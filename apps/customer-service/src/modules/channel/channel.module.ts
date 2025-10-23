import { Module } from '@nestjs/common';
import { CoreChannelModule } from '@app/corecommerce';
import { ApiTypeService } from '../../apiType/api.type';
import { ChannelGraphqlRepository } from './repositories/request/channel.graphql.repo';
import { ChannelRestRepository } from './repositories/request/channel.rest.repo';
import { ChannelRepositoryFactory } from './providers/channel.repo.provider';
import { ChannelsServiceImpl } from './services/implementation/channel.service.impl';
import { CHANNEL_SERVICE } from './services/channel.service.interface';
import { ChannelFacade } from './channel.facade';
import { RedisCacheModule } from '@app/common';

@Module({
  imports: [CoreChannelModule, RedisCacheModule],
  providers: [
    ApiTypeService,
    ChannelGraphqlRepository,
    ChannelRestRepository,
    ChannelRepositoryFactory,
    ChannelFacade,
    {
      useClass: ChannelsServiceImpl,
      provide: CHANNEL_SERVICE,
    },
  ],
  exports: [
    CHANNEL_SERVICE,
    ChannelRepositoryFactory,
    ChannelFacade,
    ChannelGraphqlRepository,
    ChannelRestRepository,
  ],
})
export class ChannelModule {}
