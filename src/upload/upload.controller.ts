import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataDto } from './form-data.dto';

@ApiTags('Upload Image')
@Controller()
export class UploadController {
  @Post('load')
  @FormDataRequest()
  getHello(@Body() dto: FormDataDto): void {
    console.log(dto);
  }
}
