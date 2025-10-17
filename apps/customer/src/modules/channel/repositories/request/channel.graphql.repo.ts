import { Injectable } from '@nestjs/common';
import { IChannelRepository } from '../channel.repositories.interface';

@Injectable()
export class ChannelGraphqlRepository implements IChannelRepository {
  getKeyById(string: any) {
    throw new Error('Method not implemented.');
  }
  /**
   *
   * @param string
   */
  async fetchChannelByKey(string: any) {}
}
