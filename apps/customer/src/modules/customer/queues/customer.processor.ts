import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { WorkerHostProcessor } from '../../../queues/worker-host.processor';
import { ModuleRef } from '@nestjs/core';
import { LoggingService, WorkspaceService } from '@comcore/ocs-lib-common';
import { CoreClientService, CoreConfigService } from '@comcore/ocs-lib-corecommerce';
import {
  CUSTOMER_EMAIL_UPDATED,
  CUSTOMER_REGISTRATION,
} from '../../utils/eventpublisher/constants/event.constants';
import { CUSTOMER_EXPANDABLES } from '../enums/common.enum';
import {
  EVENT_PUBLISHER_SERVICE,
  EventPublisherService,
} from 'src/modules/utils/eventpublisher/services/event.service';
import { CUSTOMER_MAPPER, CustomerMapper } from '../services/mappers/customer.mapper';
import { CUSTOMER_SERVICE, CustomerService } from '../services/customer.service';

@Processor('customer-queue')
export class CustomerProcessor extends WorkerHostProcessor {
  /**
   * Constructor
   * @param moduleRef
   * @param customerService
   * @param customerMapper
   * @param eventPublisherService
   * @param customerFacade
   * @param workspaceService
   * @param customerProviderRepository
   * @param customerGroupRepositoryFactory
   * @param channelFactoryRepository
   * @param coreConfigService
   * @param coreClientService
   * @param loggingService
   */
  constructor(
    protected readonly moduleRef: ModuleRef,
    @Inject(forwardRef(() => CUSTOMER_SERVICE))
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => CUSTOMER_MAPPER))
    private readonly customerMapper: CustomerMapper,
    @Inject(EVENT_PUBLISHER_SERVICE)
    private readonly eventPublisherService: EventPublisherService,
    private readonly loggingService: LoggingService,
    protected readonly workspaceService: WorkspaceService,
    protected readonly coreConfigService: CoreConfigService,
    protected readonly coreClientService: CoreClientService,
  ) {
    super(moduleRef, workspaceService, coreConfigService, coreClientService);
  }

  private readonly jobHandlers = {
    'customer-registration-pca': this.handleCustomerRegistrationPCA,
    'customer-registration-event': this.handleCustomerRegistrationEvent,
    'customer-email-updated-event': this.handleCustomerEmailUpdated,
  };

  async process(job: Job): Promise<void> {
    await this.resolveAndInjectScopedServices(job); // 🎯 Magic happens here

    const handler = this.jobHandlers[job.name];
    if (handler) {
      return handler.call(this, job); // you can now just use this.profileService etc
    }
  }

  private async handleCustomerRegistrationPCA(job: Job): Promise<void> {
    this.loggingService.info(['Job'], 'Customer Registration PCA', job.data); // Log the request
    const { customer, stores, customerData } = job.data;
    await this.customerService.addStoreAfterRegistration(customer, stores, customerData);
  }

  private async handleCustomerRegistrationEvent(job: Job): Promise<void> {
    this.loggingService.info(['Job'], 'Customer Registration Event Publish', job.data); // Log the request
    const { customer, guestCustomer, tenantId, group, eventMetaData } = job.data;
    const updatedCustomer = await this.customerService.fetchCustomerById(customer.id, true);
    if (!guestCustomer) {
      const customerArray = await this.customerMapper.toArray(updatedCustomer, [
        CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
      ]);
      await this.eventPublisherService.publish(
        tenantId,
        CUSTOMER_REGISTRATION,
        customerArray,
        group,
        eventMetaData,
      );
    }
  }

  private async handleCustomerEmailUpdated(job: Job): Promise<void> {
    this.loggingService.info(['Job'], 'Customer Email Updated Event Publish', job.data);
    const { customer, oldEmail, newEmail } = job.data;
    const tenantId = this.customerService.getTenantId(customer);
    const customerGroupKey = this.customerService.getCustomerGroupKey(customer);
    const customerArray = await this.customerMapper.toArray(customer, [
      CUSTOMER_EXPANDABLES.EXPAND_DETAILED,
    ]);
    await this.eventPublisherService.publish(
      tenantId,
      CUSTOMER_EMAIL_UPDATED,
      customerArray,
      customerGroupKey,
      { oldEmail: oldEmail, newEmail: newEmail },
    );
  }
}
