import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class BlogDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  image?: string;
  @ApiProperty()
  user: UserDto;
}
