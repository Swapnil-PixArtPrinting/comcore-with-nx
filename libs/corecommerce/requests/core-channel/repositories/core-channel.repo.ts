export const COMMERCE_CHANNEL_REPOSITORY = 'COMMERCE_CHANNEL_REPOSITORY';

export interface CommerceChannelRepository {
  /**
   *
   * @param channelKey
   */
  fetchChannelByKey(channelKey: string): Promise<any>;

  /**
   *
   * @param channelId
   */
  fetchKeyById(channelId: string): Promise<string | null>;
}
