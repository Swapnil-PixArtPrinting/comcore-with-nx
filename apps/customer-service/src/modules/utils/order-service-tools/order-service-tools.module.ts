import { forwardRef, Module } from '@nestjs/common';
import { OrderServiceToolsService } from './order-service-tools.service';
import { RequestClientModule, OrderServiceClient } from '@app/clientskit';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule, RedisCacheModule, WorkspaceModule } from '@app/common';
import { CustomerModule } from '../../customer/customer.module';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    RedisCacheModule,
    WorkspaceModule,
    forwardRef(() => CustomerModule),
  ],
  providers: [
    OrderServiceClient,
    OrderServiceToolsService,
    {
      provide: 'ORDER_SERVICE_AUTH_OPTIONS',
      useFactory: (config: ConfigService) => ({
        clientId: config.get<string>('CIMPRESS_M2M_CLIENT_ID'),
        clientSecret: config.get<string>('CIMPRESS_M2M_CLIENT_SECRET'),
        audience: config.get<string>('AUTH_IDENTIFIER'),
        appKey: config.get<string>('APP_KEY'),
        tokenUrl: config.get<string>('OCI_TOKEN_URL'),
        name: 'order-auth0',
      }),
      inject: [ConfigService],
    },
  ],
  exports: [OrderServiceToolsService],
})
export class OrderServiceToolsModule {}
