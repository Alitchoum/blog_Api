import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
export class UploadArrayImageDto {
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  @IsFiles()
  @MaxFileSize(2 * 1024 * 1024, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images: MemoryStoredFile[];
}
