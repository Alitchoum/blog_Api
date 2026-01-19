import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;
}
