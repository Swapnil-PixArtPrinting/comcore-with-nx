import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    description: 'Email of the customer',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  oldEmail: string;

  @ApiProperty({
    description: 'Email of the customer',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  newEmail: string;
}
