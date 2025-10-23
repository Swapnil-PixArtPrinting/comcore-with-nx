import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * @description Service for Redis Cache
 */
@Injectable()
export class RedisCacheService {
  /**
   * @description Constructor
   * @param cacheManager
   */
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * @description Get value from cache
   * @param key
   */
  async get<T>(key: string): Promise<T | null> {
    return (await this.cacheManager.get(key)) as T | null;
  }

  /**
   * @description Set value in cache
   * @param key
   * @param value
   * @param ttl
   */
  async set<T>(key: string, value: T, ttl = 0): Promise<void> {
    await this.cacheManager.set(key, value, ttl); // TTL = 0 means no expiration
  }

  /**
   * @description Delete value from cache
   * @param key
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
