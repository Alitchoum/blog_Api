import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
  @ApiProperty()
  @IsOptional()
  @IsArray()
  images?: string[];
  @ApiProperty()
  @IsOptional()
  @IsArray()
  tags?: string[];
  @ApiProperty()
  @IsString()
  blogId: string;
}
