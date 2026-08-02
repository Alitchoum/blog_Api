import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateBlogDto {
  @ApiProperty({ required: true, type: String, description: 'Blog title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Blog description',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'blog image cover',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
  image: MemoryStoredFile;

  @ApiProperty({ type: 'string', description: 'Category id' })
  @IsNotEmpty()
  @IsMongoId()
  category: string;
}
