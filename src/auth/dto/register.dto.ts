import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
