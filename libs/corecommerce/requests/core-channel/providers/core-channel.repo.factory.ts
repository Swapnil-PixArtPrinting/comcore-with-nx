import { Injectable } from '@nestjs/common';
import { CommerceChannelRepository } from '../repositories/core-channel.repo';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import { CommercetoolChannelRepository } from '../repositories/api/core-channel.commercetool.repo';

@Injectable()
export class CommerceChannelRepositoryFactory {
  constructor(
    private readonly coreClientService: CoreClientService,
    private readonly commercetoolRepository: CommercetoolChannelRepository,
  ) {}

  get repository(): CommerceChannelRepository {
    switch (this.coreClientService.getDataClient()) {
      case dataClient.COMMERCETOOL:
        return this.commercetoolRepository;
      default:
        return this.commercetoolRepository;
    }
  }
}
