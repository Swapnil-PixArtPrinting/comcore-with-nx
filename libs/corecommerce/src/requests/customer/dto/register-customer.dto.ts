import {
  BaseAddress,
  CartResourceIdentifier,
  CustomerGroupResourceIdentifier,
  CustomFieldsDraft,
  StoreResourceIdentifier,
} from '@commercetools/platform-sdk';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CoreRegisterCustomerDTO {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  customerNumber?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  anonymousCartId?: string;

  @IsOptional()
  @ValidateNested()
  anonymousCart?: CartResourceIdentifier;

  @IsOptional()
  @IsString()
  anonymousId?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  vatId?: string;

  @IsOptional()
  @ValidateNested()
  addresses?: BaseAddress[];

  @IsOptional()
  @IsNumber()
  defaultShippingAddress?: number;

  @IsOptional()
  @IsArray()
  shippingAddresses?: number[];

  @IsOptional()
  @IsNumber()
  defaultBillingAddress?: number;

  @IsOptional()
  @IsArray()
  billingAddresses?: number[];

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @ValidateNested()
  customerGroup?: CustomerGroupResourceIdentifier;

  @IsOptional()
  @ValidateNested()
  custom?: CustomFieldsDraft;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  salutation?: string;

  @IsOptional()
  @ValidateNested()
  stores?: StoreResourceIdentifier[];

  @IsOptional()
  @IsString()
  authenticationMode?: string;
}
