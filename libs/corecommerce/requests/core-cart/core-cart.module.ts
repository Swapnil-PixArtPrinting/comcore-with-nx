import { CoreConfigModule, CoreConfigService } from '../../config';
import { Module } from '@nestjs/common';
import { CommerceCartRepositoryFactory } from './providers/core-cart.repo.factory';
import { CommercetoolCartRepository } from './repositories/api/core-cart.commercetool.repo';
import { CommerceCartServiceImpl } from './services';
import {
    CommerceCartServiceFactory,
} from './providers/core-cart.service.factory';
import { ClientModule } from '../../client';

@Module({
    imports: [
        CoreConfigModule,
        ClientModule
    ],
    providers: [
        CoreConfigService,
        CommerceCartRepositoryFactory,
        CommercetoolCartRepository,
        CommerceCartServiceImpl,
        CommerceCartServiceFactory
    ],
    exports: [CommerceCartServiceFactory, CommerceCartRepositoryFactory]
})
export class CoreCartModule {}