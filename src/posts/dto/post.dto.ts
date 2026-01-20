import { ApiProperty } from '@nestjs/swagger';
import { BlogDto } from '../../blogs/dto/blog.dto';
import { UserDto } from '../../users/dto/user.dto';
import { PostDocument } from '../post.schema';
import { SafePopulated } from '../../_utils/is-populated.function';

export class PostDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ type: [String] })
  images: string[] | null;
  @ApiProperty()
  tags: string[] | null;
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
