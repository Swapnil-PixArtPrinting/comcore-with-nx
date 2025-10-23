import { CoreConfigModule, CoreConfigService } from '../../config';
import { Module } from '@nestjs/common';
import { CommerceChannelRepositoryFactory } from './providers/core-channel.repo.factory';
import { CommercetoolChannelRepository } from './repositories/api/core-channel.commercetool.repo';
import { CommerceChannelServiceImpl } from './services';
import { CommerceChannelServiceFactory } from './providers/core-channel.service.factory';
import { ClientModule } from '../../client';

@Module({
  imports: [CoreConfigModule, ClientModule],
  providers: [
    CoreConfigService,
    CommerceChannelRepositoryFactory,
    CommercetoolChannelRepository,
    CommerceChannelServiceImpl,
    CommerceChannelServiceFactory,
  ],
  exports: [CommerceChannelServiceFactory, CommerceChannelRepositoryFactory],
})
export class CoreChannelModule {}
