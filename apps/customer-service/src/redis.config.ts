import { Injectable } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfig {
  static getOptions(configService: ConfigService): RedisOptions {
    return {
      host:
        configService.get('APP_ENV') === 'local'
          ? 'redis'
          : configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    };
  }
}
