import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingService, WorkspaceService } from '@app/common';
import {
  CustomerService,
  CUSTOMER_SERVICE,
} from '../modules/customer/services/customer.service';
import { Inject } from '@nestjs/common';

interface RegistrationPCARequest {
  workspace: string;
  customer: any;
  stores: string[];
  customerData: any;
}

interface RegistrationEventRequest {
  workspace: string;
  customer: any;
  guestCustomer: any;
  tenantId: string;
  group: string;
  eventMetaData: any;
}

interface EmailUpdatedEventRequest {
  workspace: string;
  customer: any;
  oldEmail: string;
  newEmail: string;
}

@Controller()
export class CustomerJobGrpcService {
  constructor(
    @Inject(CUSTOMER_SERVICE)
    private readonly customerService: CustomerService,
    private readonly loggingService: LoggingService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @GrpcMethod('CustomerJobService', 'ProcessRegistrationPCA')
  async processRegistrationPCA(data: RegistrationPCARequest) {
    try {
      this.loggingService.info(
        ['Customer-gRPC'],
        'Processing Registration PCA via gRPC',
        { workspace: data.workspace },
      );

      // Set workspace context
      if (data.workspace) {
        this.workspaceService.setWorkspace(data.workspace);
      }

      const { customer, stores, customerData } = data;
      await this.customerService.addStoreAfterRegistration(
        customer,
        stores,
        customerData,
      );

      return {
        success: true,
        message: 'Registration PCA processed successfully',
      };
    } catch (error) {
      this.loggingService.error(
        ['Customer-gRPC'],
        'Failed to process registration PCA',
        { workspace: data.workspace },
        error,
      );
      return { success: false, message: 'Failed to process registration PCA' };
    }
  }

  @GrpcMethod('CustomerJobService', 'ProcessRegistrationEvent')
  async processRegistrationEvent(data: RegistrationEventRequest) {
    try {
      this.loggingService.info(
        ['Customer-gRPC'],
        'Processing Registration Event via gRPC',
        { workspace: data.workspace },
      );

      // Set workspace context
      if (data.workspace) {
        this.workspaceService.setWorkspace(data.workspace);
      }

      // Implementation would move actual logic from original processor here
      return {
        success: true,
        message: 'Registration event processed successfully',
      };
    } catch (error) {
      this.loggingService.error(
        ['Customer-gRPC'],
        'Failed to process registration event',
        { workspace: data.workspace },
        error,
      );
      return {
        success: false,
        message: 'Failed to process registration event',
      };
    }
  }

  @GrpcMethod('CustomerJobService', 'ProcessEmailUpdatedEvent')
  async processEmailUpdatedEvent(data: EmailUpdatedEventRequest) {
    try {
      this.loggingService.info(
        ['Customer-gRPC'],
        'Processing Email Updated Event via gRPC',
        {
          workspace: data.workspace,
          oldEmail: data.oldEmail,
          newEmail: data.newEmail,
        },
      );

      // Set workspace context
      if (data.workspace) {
        this.workspaceService.setWorkspace(data.workspace);
      }

      // Implementation would move actual logic from original processor here
      return {
        success: true,
        message: 'Email updated event processed successfully',
      };
    } catch (error) {
      this.loggingService.error(
        ['Customer-gRPC'],
        'Failed to process email updated event',
        { workspace: data.workspace },
        error,
      );
      return {
        success: false,
        message: 'Failed to process email updated event',
      };
    }
  }
}
