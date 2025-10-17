import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import { AddressCommercetoolService } from '../services/implementations/address.commercetool.service';
import { ICoreAddressService } from '../services/address.interface.service';

@Injectable()
export class CommerceAddressServiceFactory {
  constructor(
    private readonly coreClientService: CoreClientService,
    @Inject(forwardRef(() => AddressCommercetoolService))
    private readonly commerceCustomerService: AddressCommercetoolService,
  ) {}

  get service(): ICoreAddressService {
    switch (this.coreClientService.getDataClient()) {
      case dataClient.COMMERCETOOL:
        return this.commerceCustomerService;
      default:
        return this.commerceCustomerService;
    }
  }
}
