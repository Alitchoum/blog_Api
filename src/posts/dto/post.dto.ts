import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BlogDto } from '../../blogs/dto/blog.dto';
import { UserDto } from '../../users/dto/user.dto';
import { PostDocument } from '../post.schema';
import { SafePopulated } from '../../_utils/is-populated.function';

export class PostDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
  @ApiProperty()
  @IsOptional()
  @IsArray()
  images?: string[];
  @ApiProperty()
  @IsOptional()
  @IsArray()
  tags?: string[];
  @ApiProperty()
  blog: BlogDto;
  @ApiProperty()
  user: UserDto;

  static toPostDto(post: PostDocument): PostDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      images: post.images,
      tags: post.tags,
      blog: BlogDto.toBlogDto(SafePopulated(post.blog)),
      user: UserDto.toUserDto(SafePopulated(post.user)),
    };
  }
}
