import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadImageDto } from './dto/request/form-data.dto';
import { UploadArrayImageDto } from './dto/request/form-data-array.dto';
import { Protect } from '../auth/protect.decorator';
import { UploadService } from './upload.service';

@ApiTags('Upload Image')
@Controller()
class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @Protect()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload one Image' })
  uploadOneImage(@Body() dto: UploadImageDto) {
    return this.uploadService.saveImage(dto.image);
  }

  @Post('images')
  @Protect()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload images' })
  uploadImages(@Body() dto: UploadArrayImageDto) {
    return this.uploadService.saveImages(dto.images);
  }
}

export default UploadController;
