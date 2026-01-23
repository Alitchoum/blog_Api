import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, type: String })
  @MinLength(8)
  password: string;
}
