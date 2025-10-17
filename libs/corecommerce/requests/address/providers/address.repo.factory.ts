import { Injectable } from '@nestjs/common';
import { CoreClientService } from '../../../config';
import { dataClient } from "libs/corecommerce/constants";
import { AddressCommercetoolRepo } from '../repositories/api/address.commercetool.repo';
import { ICoreAddressRepository } from '../repositories/address.repo';

@Injectable()
export class CommerceAddressRepositoryFactory {
    constructor(
      private readonly coreClientService: CoreClientService,
      private readonly commercetoolRepository: AddressCommercetoolRepo,
    ) {}

    get repository(): ICoreAddressRepository {
        switch (this.coreClientService.getDataClient()) {
            case dataClient.COMMERCETOOL:
                return this.commercetoolRepository;
            default:
                return this.commercetoolRepository;
        }
    }
}