import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class UpdatePostDto {
  @ApiPropertyOptional({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @IsOptional()
  @IsFile({ each: true })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { each: true })
  images?: MemoryStoredFile[];

  @ApiPropertyOptional({ type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;
}
