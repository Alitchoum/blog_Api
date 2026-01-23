import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ required: true, type: String, format: 'binary' })
  @IsFile()
  @MaxFileSize(2 * 1024 * 1024)
  @HasMimeType(['image/jpeg', 'image/png'])
  image: MemoryStoredFile;
}
