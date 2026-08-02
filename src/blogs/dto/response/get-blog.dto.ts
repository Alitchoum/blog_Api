import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetUserLightDto } from '../../../users/dto/response/get-user-light.dto';
import { GetCategoryDto } from '../../../category/dto/response/get-category.dto';

export class GetBlogDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ type: GetCategoryDto })
  category: GetCategoryDto;

  @ApiProperty({ type: GetUserLightDto })
  @IsNotEmpty()
  user: GetUserLightDto;
}
