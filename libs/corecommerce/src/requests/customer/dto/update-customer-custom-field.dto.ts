import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerCustomField {
  @IsString()
  action: 'setCustomField';

  @IsString()
  name: string;

  @IsOptional()
  value?: any;
}
