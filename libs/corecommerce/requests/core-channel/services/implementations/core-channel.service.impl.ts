import { Injectable } from "@nestjs/common";
import { CommerceChannelService } from "../core-channel.service";
import { ChannelModel } from "../../models";
import { CommerceChannelRepositoryFactory } from '../../providers/core-channel.repo.factory';

@Injectable()
export class CommerceChannelServiceImpl implements CommerceChannelService {
    constructor(
        private readonly commerceChannelRepository: CommerceChannelRepositoryFactory
    ){
    }

    async getKeyById(channelId: string): Promise<string | null> {
        const channelKey = await this.commerceChannelRepository.repository.fetchKeyById(channelId);
        return channelKey;
    }
    
    async fetchChannelByKey(channelKey: string): Promise<ChannelModel | null> {
        const channelData = await this.commerceChannelRepository.repository.fetchChannelByKey(channelKey);
        return channelData;
    }
}