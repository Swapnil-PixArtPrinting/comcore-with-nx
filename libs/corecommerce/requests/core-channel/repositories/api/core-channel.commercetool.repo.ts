import { Inject, Injectable } from '@nestjs/common';
import { CommerceChannelRepository } from '../core-channel.repo';
import { CoreClientService, CoreConfigService } from '../../../../config';
import { ChannelModel } from '../../models';

@Injectable()
export class CommercetoolChannelRepository implements CommerceChannelRepository {

    constructor(
        @Inject(CoreConfigService)
        private readonly coreConfigService: CoreConfigService,
        @Inject(CoreClientService)
        private readonly coreClientService: CoreClientService,
    ){}

    async fetchKeyById(channelId: string): Promise<string | null> {
        const channelDataCollection = await this.coreClientService
                                                .getClient()
                                                .channels()
                                                .withId({ID: channelId})
                                                .get()
                                                .execute();

        const channel = channelDataCollection.body && Object.keys(channelDataCollection.body).length > 0 ? channelDataCollection.body : null; 
        return channel ? channel.key : null;
    }

    /**
     *
     * @param channelKey
     */
    async fetchChannelByKey(channelKey: string): Promise<ChannelModel | null> {
        const channelDataCollection = await this.coreClientService
                                                    .getClient()
                                                    .channels()
                                                    .withKey({key: channelKey})
                                                    .get()
                                                    .execute();

        return channelDataCollection.body && Object.keys(channelDataCollection.body).length > 0 ? channelDataCollection.body : null;
    }
}