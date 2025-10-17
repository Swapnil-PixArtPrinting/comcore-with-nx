import type { CustomerGroupResourceIdentifier } from '@commercetools/platform-sdk';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateCustomerGroupDto {
  @IsString()
  action: 'setCustomerGroup';

  @IsOptional()
  @ValidateNested()
  customerGroup?: CustomerGroupResourceIdentifier;
}
