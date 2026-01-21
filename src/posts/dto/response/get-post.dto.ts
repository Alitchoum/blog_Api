import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/user.dto';
import { BlogLigthDto } from '../../../blogs/dto/blog-ligth.dto';
import { Nullable } from 'class-validator-extended';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({ required: true, type: BlogLigthDto })
  blog: BlogLigthDto;

  @ApiProperty({ required: true, type: UserDto })
  user: UserDto;
}
