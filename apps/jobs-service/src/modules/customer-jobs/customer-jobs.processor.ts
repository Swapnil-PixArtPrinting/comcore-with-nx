import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Inject } from '@nestjs/common';
import { LoggingService, WorkspaceService } from '@app/common';
import { CoreClientService, CoreConfigService } from '@app/corecommerce';
import { ModuleRef } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { WorkerHostProcessor } from '../../queues/worker-host.processor';

interface CustomerJobGrpcService {
  processRegistrationPCA(data: any): Promise<any>;
  processRegistrationEvent(data: any): Promise<any>;
  processEmailUpdatedEvent(data: any): Promise<any>;
}

@Processor('customer-queue')
@Injectable()
export class CustomerJobsProcessor extends WorkerHostProcessor {
  private customerGrpcService: CustomerJobGrpcService;

  constructor(
    protected readonly moduleRef: ModuleRef,
    protected readonly workspaceService: WorkspaceService,
    protected readonly coreConfigService: CoreConfigService,
    protected readonly coreClientService: CoreClientService,
    @Inject('CUSTOMER_GRPC_SERVICE') private readonly client: ClientGrpc,
    private readonly loggingService: LoggingService,
  ) {
    super(moduleRef, workspaceService, coreConfigService, coreClientService);
  }

  onModuleInit() {
    this.customerGrpcService =
      this.client.getService<CustomerJobGrpcService>('CustomerJobService');
  }

  private readonly jobHandlers = {
    'customer-registration-pca': this.handleCustomerRegistrationPCA.bind(this),
    'customer-registration-event':
      this.handleCustomerRegistrationEvent.bind(this),
    'customer-email-updated-event': this.handleCustomerEmailUpdated.bind(this),
  };

  async process(job: Job): Promise<void> {
    this.loggingService.info(['Jobs-Service'], `Processing job: ${job.name}`, {
      jobId: job.id,
      jobName: job.name,
    });

    const handler = this.jobHandlers[job.name];
    if (handler) {
      return handler.call(this, job);
    } else {
      this.loggingService.error(
        ['Jobs-Service'],
        `No handler found for job: ${job.name}`,
        { jobName: job.name },
        null,
      );
    }
  }

  private async handleCustomerRegistrationPCA(job: Job): Promise<void> {
    this.loggingService.info(
      ['Jobs-Service'],
      'Customer Registration PCA',
      job.data,
    );

    try {
      const { customer, stores, customerData, workspace } = job.data;

      // Call customer service via gRPC
      const result = await this.customerGrpcService.processRegistrationPCA({
        workspace,
        customer,
        stores,
        customerData,
      });

      this.loggingService.info(
        ['Jobs-Service'],
        'Successfully processed customer registration PCA',
        { customerId: customer?.id },
      );
    } catch (error) {
      this.loggingService.error(
        ['Jobs-Service'],
        'Failed to process customer registration PCA',
        { jobData: job.data },
        error,
      );
      throw error;
    }
  }

  private async handleCustomerRegistrationEvent(job: Job): Promise<void> {
    this.loggingService.info(
      ['Jobs-Service'],
      'Customer Registration Event Publish',
      job.data,
    );

    try {
      const {
        customer,
        guestCustomer,
        tenantId,
        group,
        eventMetaData,
        workspace,
      } = job.data;

      // Call customer service via gRPC
      const result = await this.customerGrpcService.processRegistrationEvent({
        workspace,
        customer,
        guestCustomer,
        tenantId,
        group,
        eventMetaData,
      });

      this.loggingService.info(
        ['Jobs-Service'],
        'Successfully processed customer registration event',
        { customerId: customer?.id },
      );
    } catch (error) {
      this.loggingService.error(
        ['Jobs-Service'],
        'Failed to process customer registration event',
        { jobData: job.data },
        error,
      );
      throw error;
    }
  }

  private async handleCustomerEmailUpdated(job: Job): Promise<void> {
    this.loggingService.info(
      ['Jobs-Service'],
      'Customer Email Updated Event Publish',
      job.data,
    );

    try {
      const { customer, oldEmail, newEmail, workspace } = job.data;

      // Call customer service via gRPC
      const result = await this.customerGrpcService.processEmailUpdatedEvent({
        workspace,
        customer,
        oldEmail,
        newEmail,
      });

      this.loggingService.info(
        ['Jobs-Service'],
        'Successfully processed customer email updated event',
        { customerId: customer?.id },
      );
    } catch (error) {
      this.loggingService.error(
        ['Jobs-Service'],
        'Failed to process customer email updated event',
        { jobData: job.data },
        error,
      );
      throw error;
    }
  }
}
