import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetBlogLigthDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;
}
