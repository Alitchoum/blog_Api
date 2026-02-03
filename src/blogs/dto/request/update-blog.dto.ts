import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' }) // Pour Swagger
  @Optional()
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
  image?: MemoryStoredFile;
}
