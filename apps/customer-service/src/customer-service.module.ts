import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CustomerModule } from './modules/customer/customer.module';
import { CustomerGroupModule } from './modules/customer-group/customer-group.module';
import { ChannelModule } from './modules/channel/channel.module';
import { CustomerNumberGeneratorModule } from './modules/utils/customer-number-generator/customer-number-generator.module';
import {
  CoreChannelModule,
  CoreCartModule,
  CoreCommerceModule,
  RequestsModule,
} from '@app/corecommerce';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { EventPublisherModule } from './modules/utils/eventpublisher/eventpublisher.module';
import { AwskitModule, SecretsManagerModule } from '@app/awskit';
import { SnsModule } from '@app/awskit';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { EnvSetupModule } from './env-setup/env-setup.module';
import { SetWorkspaceMiddleware } from './middlewares/SetWorkspace.middleware';
import { VerifyJwtMiddleware } from './middlewares/VerifyJwt.middleware';
import { EnvSetupCommand } from './env-setup/env-setup.command';
import { CommandModule } from 'nestjs-command';
import { SsoModule } from './modules/utils/sso/sso.module';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerService } from './modules/utils/swagger/swagger.service';
import {
  CoreCommerceConfigModule,
  TenantConfigModule,
  WorkspaceModule,
  LoggerModule,
  RedisCacheModule,
  CustomJwtModule,
} from '@app/common';
import { API_V2_BASE_PATH } from './shared/constants/api.constants';
import { DatabaseModule } from './database/database.module';
import { OrderServiceToolsModule } from './modules/utils/order-service-tools/order-service-tools.module';
import { RedisConfig } from './redis.config';
import { BullModule } from '@nestjs/bullmq';
import { ApiTypeService } from './apiType/api.type';

/**
 * Main module of the application
 * imports: List of modules that are imported in the application
 * providers: List of services that are provided in the application
 * exports: List of services that are exported in the application
 */
@Module({
  imports: [
    ChannelModule,
    CommandModule,
    CoreChannelModule,
    CoreCartModule,
    CoreCommerceConfigModule,
    CoreCommerceModule,
    LoggerModule,
    CustomerGroupModule,
    CustomerNumberGeneratorModule,
    OrderServiceToolsModule,
    EnvSetupModule,
    EventPublisherModule,
    TenantConfigModule,
    RequestsModule,
    RedisCacheModule,
    CustomerModule,
    AwskitModule,
    SnsModule,
    SecretsManagerModule,
    WorkspaceModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
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
    SwaggerModule,
    SsoModule,
    EnvSetupModule,
    DatabaseModule,
    CustomJwtModule,
  ],
  controllers: [CustomerServiceController],
  providers: [
    CustomerServiceService,
    EnvSetupCommand,
    SwaggerService,
    ApiTypeService,
  ],
  exports: [CustomerServiceService],
})
export class CustomerServiceModule {
  // Middleware configuration for incoming requests
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetWorkspaceMiddleware, VerifyJwtMiddleware)
      .forRoutes(API_V2_BASE_PATH);
  }
}
