import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import {
    CommerceChannelService,
    CommerceChannelServiceImpl,
} from '../..';

@Injectable()
export class CommerceChannelServiceFactory {
    constructor(
      private readonly coreClientService: CoreClientService,
      @Inject(forwardRef(() => CommerceChannelServiceImpl))
      private readonly commerceCustomerService: CommerceChannelServiceImpl,
    ) {}

    get service(): CommerceChannelService {
        switch (this.coreClientService.getDataClient()) {
            case dataClient.COMMERCETOOL:
                return this.commerceCustomerService;
            default:
                return this.commerceCustomerService;
        }
    }
}