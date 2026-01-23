import { ApiProperty } from '@nestjs/swagger';
import { GetBlogLigthDto } from '../../../blogs/dto/response/get-blog-ligth.dto';
import { Nullable } from 'class-validator-extended';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { GetUserLightDto } from '../../../users/dto/response/get-user-light.dto';

export class GetPostDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [String], nullable: true })
  @Nullable()
  @IsArray()
  @IsString({ each: true })
  images: string[] | null;

  @ApiProperty({ type: [String], nullable: true })
  @Nullable()
  @IsArray()
  @IsString({ each: true })
  tags: string[] | null;

  @ApiProperty({ required: true, type: GetBlogLigthDto })
  blog: GetBlogLigthDto;

  @ApiProperty({ required: true, type: GetUserLightDto })
  user: GetUserLightDto;
}
