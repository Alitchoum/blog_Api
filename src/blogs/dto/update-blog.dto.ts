import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  image?: string;
}
