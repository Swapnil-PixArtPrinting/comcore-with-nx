import { Injectable } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from "libs/corecommerce/constants";
import { CommercetoolCartRepository } from '../repositories/api/core-cart.commercetool.repo';
import { ICommerceCartRepository } from '../repositories/core-cart.repo';

@Injectable()
export class CommerceCartRepositoryFactory {
    constructor(
      private readonly coreClientService: CoreClientService,
      private readonly commercetoolRepository: CommercetoolCartRepository,
    ) {}

    get repository(): ICommerceCartRepository {
        switch (this.coreClientService.getDataClient()) {
            case dataClient.COMMERCETOOL:
                return this.commercetoolRepository;
            default:
                return this.commercetoolRepository;
        }
    }
}