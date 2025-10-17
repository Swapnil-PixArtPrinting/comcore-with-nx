import { Injectable } from '@nestjs/common';
import { CommerceCustomerRepository } from '../repositories/customer.repo';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import { CommercetoolRepository } from '../repositories/api/customer.commercetool.repo';

@Injectable()
export class CommerceCustomerRepositoryFactory {
  constructor(
    private readonly coreClientService: CoreClientService,
    private readonly commercetoolRepository: CommercetoolRepository,
  ) {}

  get repository(): CommerceCustomerRepository {
    switch (this.coreClientService.getDataClient()) {
      case dataClient.COMMERCETOOL:
        return this.commercetoolRepository;
      default:
        return this.commercetoolRepository;
    }
  }
}
