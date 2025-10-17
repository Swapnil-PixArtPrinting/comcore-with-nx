import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import {
    CommerceCustomerGroupService,
    CommerceCustomerGroupServiceImpl,
} from '../services';

@Injectable()
export class CommerceCustomerGroupServiceFactory {
    constructor(
      private readonly coreClientService: CoreClientService,
      @Inject(forwardRef(() => CommerceCustomerGroupServiceImpl)) // Use forwardRef here
      private readonly commerceCustomerService: CommerceCustomerGroupServiceImpl,
    ) {}

    get service(): CommerceCustomerGroupService {
        switch (this.coreClientService.getDataClient()) {
            case dataClient.COMMERCETOOL:
                return this.commerceCustomerService;
            default:
                return this.commerceCustomerService;
        }
    }
}