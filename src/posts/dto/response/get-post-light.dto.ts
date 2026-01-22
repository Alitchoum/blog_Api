import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostLightDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
}
