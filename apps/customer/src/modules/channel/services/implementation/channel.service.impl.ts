import { Injectable } from '@nestjs/common';
import { IChannelService } from '../channel.service.interface';

@Injectable()
export class ChannelsServiceImpl implements IChannelService {
  constructor() {}
}
