import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class BlogLigthDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: String })
  @Optional()
  @IsString()
  image?: string;
}
