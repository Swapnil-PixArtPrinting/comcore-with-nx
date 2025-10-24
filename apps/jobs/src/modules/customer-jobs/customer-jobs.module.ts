import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CustomerJobsProcessor } from './customer-jobs.processor';
import { LoggerModule, WorkspaceModule } from '@app/common';
import { CoreCommerceModule, CoreConfigModule } from '@app/corecommerce';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'customer-queue',
    }),
    ClientsModule.register([
      {
        name: 'CUSTOMER_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'customer',
          protoPath: '/app/proto/customer-job.proto',
          url: 'customer:50051',
        },
      },
    ]),
    LoggerModule,
    WorkspaceModule,
    CoreCommerceModule,
    CoreConfigModule,
  ],
  providers: [CustomerJobsProcessor],
  exports: [CustomerJobsProcessor],
})
export class CustomerJobsModule {}
