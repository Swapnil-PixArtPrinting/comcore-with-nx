import { OrderServiceClient } from '@comcore/ocs-clients-kit';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomerModel } from '@comcore/ocs-lib-corecommerce';
import { UPDATE_CUSTOMER_EMAIL_URL } from '../../../shared/constants/urls.constants';
import {
  CUSTOMER_SERVICE,
  CustomerService,
} from '../../customer/services/customer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderServiceToolsService {
  private readonly baseUrl: string;

  constructor(
    private readonly orderServiceClient: OrderServiceClient,
    @Inject(forwardRef(() => CUSTOMER_SERVICE))
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('ORDER_SERVICE_URL');
  }

  /**
   * @description: Updates the email of a customer in the order service.
   * @param customer
   * @param oldEmail
   * @param newEmail
   */
  async updateCustomerEmail(
    customer: CustomerModel,
    oldEmail: string,
    newEmail: string,
  ) {
    const url = `${this.baseUrl}${UPDATE_CUSTOMER_EMAIL_URL}`;

    const isCompany = this.customerService.getIsCompany(customer);
    const companyIdReference =
      this.customerService.getCompanyIdFromCustomer(customer);
    const isMLAMCustomer = isCompany || !!companyIdReference;

    const payload: Record<string, any> = { oldEmail, newEmail };
    if (isMLAMCustomer) {
      const companyId = isCompany ? customer.id : companyIdReference?.id;
      payload.isMLAMCustomer = true;
      payload.companyId = companyId;
    }

    return await this.orderServiceClient.request(
      url,
      payload,
      'Error occurred in dispatching cart update job',
      'patch',
    );
  }
}
