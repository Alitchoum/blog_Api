import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Images associées au post',
  })
  @IsFile({ each: true })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { each: true })
  images: MemoryStoredFile[];

  @ApiPropertyOptional({ type: [String] })
  @Optional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.includes(',')
        ? value.split(',').map((t) => t.trim())
        : [value.trim()];
    }
    return value;
  })
  tags?: string[];

  @ApiProperty({ required: true })
  @IsString()
  blogId: string;
}
