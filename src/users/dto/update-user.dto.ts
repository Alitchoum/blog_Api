import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdateUserDto {
  @ApiProperty()
  @Optional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty()
  @Optional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @Optional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password?: string;
}
