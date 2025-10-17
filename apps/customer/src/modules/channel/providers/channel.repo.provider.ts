import { Injectable } from '@nestjs/common';
import { ChannelRestRepository } from '../repositories/request/channel.rest.repo';
import { ChannelGraphqlRepository } from '../repositories/request/channel.graphql.repo';
import { ApiTypeService } from '../../../apiType/api.type';
import { IChannelRepository } from '../repositories/channel.repositories.interface';
import { ApiType } from '../../../shared/enums/api-type.enum';

@Injectable()
export class ChannelRepositoryFactory {
  constructor(
    private readonly apiTypeService: ApiTypeService,
    private readonly graphqlRepo: ChannelGraphqlRepository,
    private readonly restRepo: ChannelRestRepository,
  ) {}

  get repository(): IChannelRepository {
    switch (this.apiTypeService.getApiType()) {
      case ApiType.GRAPHQL:
        return this.graphqlRepo;
      case ApiType.REST:
        return this.restRepo;
      default:
        return this.restRepo;
    }
  }
}
