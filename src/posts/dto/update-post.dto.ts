import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title?: string | null;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string | null;
  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[] | null;
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]; //| null;
}
