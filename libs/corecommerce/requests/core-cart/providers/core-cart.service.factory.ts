import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from 'libs/corecommerce/constants';
import { ICommerceCartService, CommerceCartServiceImpl } from '../services';

@Injectable()
export class CommerceCartServiceFactory {
  constructor(
    private readonly coreClientService: CoreClientService,
    @Inject(forwardRef(() => CommerceCartServiceImpl))
    private readonly commerceCartService: CommerceCartServiceImpl,
  ) {}

  get service(): ICommerceCartService {
    switch (this.coreClientService.getDataClient()) {
      case dataClient.COMMERCETOOL:
        return this.commerceCartService;
      default:
        return this.commerceCartService;
    }
  }
}
