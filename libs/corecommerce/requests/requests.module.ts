import { Module } from '@nestjs/common';
import { ClientModule } from '../client';
import { CoreCustomerModule } from './customer/core-customer.module';
import { CoreCustomerGroupModule } from './core-customer-group';
import { CoreChannelModule } from './core-channel/core-channel.module';
import { CoreAddressModule } from './address/address.module';
import { CoreConfigModule } from '../config';
import { CoreCartModule } from "./core-cart/core-cart.module";

@Module({
    imports: [CoreCustomerModule, CoreCustomerGroupModule, CoreChannelModule, CoreCartModule, CoreConfigModule, ClientModule, CoreAddressModule],
    providers: [
    ],
    exports: []
})
export class RequestsModule {}
