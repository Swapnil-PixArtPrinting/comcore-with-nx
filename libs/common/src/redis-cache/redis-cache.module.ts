import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

/**
 * @description Module for Redis Cache
 */
@Module({
  imports: [],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
