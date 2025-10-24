import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  ValidateIf,
  ValidateNested,
  IsArray,
  IsObject,
} from 'class-validator';
import { ExternalAuthDto } from './external-auth.dto';

export class RegisterCustomerDto {
  @ApiPropertyOptional({ description: 'First name of the customer' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name of the customer' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email of the customer',
    example: 'user@example.com',
  })
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is inappropriate' })
  email: string;

  @ApiPropertyOptional({
    description: 'Password (Required if externalAuth is not provided)',
  })
  @ValidateIf((o) => !o.externalAuth)
  @IsDefined({
    message: 'Password is required when externalAuth is not provided',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiPropertyOptional({
    description:
      'External authentication details (Required if password is not provided)',
    type: () => ExternalAuthDto,
  })
  @ValidateIf((o) => !o.password)
  @IsDefined({
    message: 'ExternalAuth is required when password is not provided',
  })
  @ValidateNested()
  @Type(() => ExternalAuthDto)
  externalAuth?: ExternalAuthDto;

  @ApiPropertyOptional({ description: 'Customer group' })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiPropertyOptional({ description: 'Tenant ID' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'VAT ID' })
  @IsOptional()
  @IsString()
  vatId?: string;

  @ApiPropertyOptional({ description: 'External ID' })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ description: 'Locale preference' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ description: 'Immediate Parent ID' })
  @IsOptional()
  @IsString()
  immediateParentId?: string;

  @ApiPropertyOptional({ description: 'Immediate Parent ID' })
  @IsOptional()
  @IsString()
  companyRole?: string;

  @ApiPropertyOptional({ description: 'List of store IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Stores field should be string' })
  stores?: string[];

  @ApiPropertyOptional({ description: 'Primary store' })
  @IsOptional()
  @IsString()
  store?: string;

  @ApiPropertyOptional({ description: 'Metadata as an object' })
  @IsOptional()
  @IsObject()
  businessData?: Record<string, any>;
}
