import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateBlogDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' }) // Pour Swagger
  @IsOptional()
  @IsFile()
  @MaxFileSize(5 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'])
  image?: MemoryStoredFile;
}
