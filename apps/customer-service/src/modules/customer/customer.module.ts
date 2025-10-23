import { forwardRef, Module, Scope } from '@nestjs/common';
import {
  CoreChannelModule,
  CoreCommerceModule,
  CoreConfigModule,
  RequestsModule,
  CoreCustomerGroupModule,
  CoreCustomerModule,
} from '@app/corecommerce';
import { CustomerNumberGeneratorModule } from '../utils/customer-number-generator/customer-number-generator.module';
import { ApiTypeService } from '../../apiType/api.type';
import {
  LoggerModule,
  TENANT_CONFIG_REPO,
  TENANT_CONFIG_SERVICE,
  TenantConfigRepoImpl,
  TenantConfigServiceImpl,
  WorkspaceModule,
  ExecutionProfilerModule,
  RedisCacheService,
} from '@app/common';
import { CustomerRestRepository } from './repositories/customer-rest.repository';
import { CustomerProviderRepository } from './repositories/customer-provider.repository';
import { CustomerGroupRepositoryFactory } from '../customer-group/providers/customer-group.repo.provider';
import { ChannelRepositoryFactory } from '../channel/providers/channel.repo.provider';
import { CoreCommerceInitializerModule } from '../core-commerce-initializer/core-commerce-initializer.module';
import { EventPublisherModule } from '../utils/eventpublisher/eventpublisher.module';
import { CUSTOMER_FACADE, CustomerFacade } from './services/customer.facade';
import { CustomerGroupFacade } from '../customer-group/services/customer-group.facade';
import { ChannelFacade } from '../channel/channel.facade';
import { BullModule } from '@nestjs/bullmq';
import { CustomerGroupGraphqlRepository } from '../customer-group/repositories/request/customer-group.graphql.repo';
import { CustomerGroupRestRepository } from '../customer-group/repositories/request/customer-group.rest.repo';
import { ChannelGraphqlRepository } from '../channel/repositories/request/channel.graphql.repo';
import { ChannelRestRepository } from '../channel/repositories/request/channel.rest.repo';
import { OrderServiceToolsModule } from '../utils/order-service-tools/order-service-tools.module';
import { CUSTOMER_SERVICE, CustomerService } from './services/customer.service';
import { MlamService } from './services/mlam.service';
import { CustomerController } from './customer.controller';
import {
  CUSTOMER_MAPPER,
  CustomerMapper,
} from './services/mappers/customer.mapper';
import { AddressModule } from '../address/address.module';
import { HttpModule } from '@nestjs/axios';
import { CustomerJobGrpcService } from '../../grpc/customer-job-grpc.service';

/**
 * @description Module for Profile
 */
@Module({
  imports: [
    forwardRef(() => CoreCustomerModule),
    CoreChannelModule,
    CustomerNumberGeneratorModule,
    OrderServiceToolsModule,
    CoreCommerceInitializerModule,
    EventPublisherModule,
    WorkspaceModule,
    LoggerModule,
    CoreCustomerGroupModule,
    ExecutionProfilerModule,
    AddressModule,
    BullModule.registerQueue({
      name: 'customer-queue',
    }),
    CoreCommerceModule,
    CoreConfigModule,
    RequestsModule,
    HttpModule,
  ],
  controllers: [CustomerController],
  providers: [
    ApiTypeService,
    CustomerRestRepository,
    CustomerProviderRepository,
    CustomerGroupRepositoryFactory,
    ChannelRepositoryFactory,
    ChannelGraphqlRepository,
    ChannelRestRepository,
    RedisCacheService,
    CustomerGroupGraphqlRepository,
    CustomerGroupRestRepository,
    MlamService,
    CustomerGroupFacade,
    ChannelFacade,
    CustomerJobGrpcService,
    {
      useClass: TenantConfigServiceImpl,
      provide: TENANT_CONFIG_SERVICE,
      scope: Scope.REQUEST,
    },
    {
      useClass: TenantConfigRepoImpl,
      provide: TENANT_CONFIG_REPO,
      scope: Scope.REQUEST,
    },
    {
      useClass: CustomerService,
      provide: CUSTOMER_SERVICE,
      scope: Scope.REQUEST,
    },
    {
      useClass: CustomerMapper,
      provide: CUSTOMER_MAPPER,
      scope: Scope.REQUEST,
    },
    {
      useClass: CustomerFacade,
      provide: CUSTOMER_FACADE,
      scope: Scope.REQUEST,
    },
  ],
  exports: [
    CUSTOMER_SERVICE,
    CUSTOMER_MAPPER,
    CustomerProviderRepository,
    CUSTOMER_FACADE,
    MlamService,
  ],
})
export class CustomerModule {}
