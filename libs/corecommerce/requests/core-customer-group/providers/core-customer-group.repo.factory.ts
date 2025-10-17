import { CoreClientService } from '../../../config';
import { dataClient } from "libs/corecommerce/constants";
import { CommercetoolCustomerGroupRepository } from "../repositories/api/core-customer-group.commercetool.repo";
import { Injectable } from '@nestjs/common';
import {
    CommerceCustomerGroupRepository
} from '../repositories/core-customer-group.repo';

@Injectable()
export class CommerceCustomerGroupRepositoryFactory {
    constructor(
      private readonly coreClientService: CoreClientService,
      private readonly commercetoolRepository: CommercetoolCustomerGroupRepository,
    ) {}

    get repository(): CommerceCustomerGroupRepository {
        switch (this.coreClientService.getDataClient()) {
            case dataClient.COMMERCETOOL:
                return this.commercetoolRepository;
            default:
                return this.commercetoolRepository;
        }
    }
}