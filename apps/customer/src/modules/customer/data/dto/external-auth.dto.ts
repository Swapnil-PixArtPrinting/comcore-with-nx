import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * ExternalAuthDto
 */
export class ExternalAuthDto {
  @ApiProperty({ description: 'Social Platform', example: 'user@example.com' })
  @IsString()
  socialPlatform: string;

  @ApiProperty({ description: 'Unique ID' })
  @IsString()
  uniqueId: string;

  @ApiProperty({ description: 'Locale' })
  @IsString()
  locale: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: 'Referrer URL' })
  @IsUrl()
  referrerUrl: string;
}
