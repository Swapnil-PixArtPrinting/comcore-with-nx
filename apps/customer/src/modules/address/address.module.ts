import { Module } from '@nestjs/common';
import { AddressMapper } from './services/address.mapper';
import { AddressService } from './services/address.service';

/**
 * @description Module for Address
 */
@Module({
  providers: [AddressMapper, AddressService],
  exports: [AddressService, AddressMapper],
})
export class AddressModule {}
