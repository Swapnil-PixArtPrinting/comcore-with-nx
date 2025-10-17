export const CHANNEL_REPOSITORY = 'CHANNEL_REPOSITORY';

export interface IChannelRepository {
  /**
   *
   * @param string
   */
  fetchChannelByKey(string);

  /**
   *
   * @param string
   */
  getKeyById(string);
}
