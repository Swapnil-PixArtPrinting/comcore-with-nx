import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisConfig } from './redis.config';
import { CustomerJobsModule } from './modules/customer-jobs/customer-jobs.module';
import { LoggerModule, WorkspaceModule, RedisCacheModule } from '@app/common';
import {
  CoreCommerceModule,
  CoreConfigModule,
  RequestsModule,
} from '@app/corecommerce';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        ...RedisConfig.getOptions(configService),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: RedisConfig.getOptions(configService),
      }),
    }),
    LoggerModule,
    WorkspaceModule,
    RedisCacheModule,
    CoreCommerceModule,
    CoreConfigModule,
    RequestsModule,
    CustomerJobsModule,
  ],
})
export class AppModule {}
