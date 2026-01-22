import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';

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

  @ApiProperty({ type: String })
  @Optional()
  @IsString()
  image?: string;
}
