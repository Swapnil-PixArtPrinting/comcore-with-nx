export const COMMERCE_CHANNEL_SERVICE = 'COMMERCE_CHANNEL_SERVICE';

export interface CommerceChannelService {
  /**
   *
   * @param channelKey
   */
  fetchChannelByKey(channelKey: string): Promise<any>;

  /**
   *
   * @param channelId
   */
  getKeyById(channelId: string): Promise<any>;
}
