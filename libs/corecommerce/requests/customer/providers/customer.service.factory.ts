import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import { CommerceCustomerService, CommerceCustomerServiceImpl } from '../services';

@Injectable()
export class CommerceCustomerServiceFactory {
    constructor(
      private readonly coreClientService: CoreClientService,
      @Inject(forwardRef(() => CommerceCustomerServiceImpl))
      private readonly commerceCustomerService: CommerceCustomerServiceImpl,
    ) {}

    get service(): CommerceCustomerService {
        switch (this.coreClientService.getDataClient()) {
            case dataClient.COMMERCETOOL:
                return this.commerceCustomerService;
            default:
                return this.commerceCustomerService;
        }
    }
}