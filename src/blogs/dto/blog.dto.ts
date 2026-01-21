import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';
import { Nullable, Optional } from 'class-validator-extended';

export class BlogDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: String, nullable: true })
  @Optional()
  @Nullable()
  @IsString()
  image?: string | null;

  @ApiProperty({ type: UserDto })
  @IsNotEmpty()
  user: UserDto;
}
