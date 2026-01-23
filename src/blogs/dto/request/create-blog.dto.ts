import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';

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

  @ApiPropertyOptional({ type: String })
  @Optional()
  @IsString()
  image?: string;
}
