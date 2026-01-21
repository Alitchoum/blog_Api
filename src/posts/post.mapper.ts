import { Injectable } from '@nestjs/common';
import { PostDocument } from './post.schema';
import { SafePopulated } from '../_utils/is-populated.function';
import { GetPostDto } from './dto/response/get-post.dto';
import { UserMapper } from '../users/user-mapper';
import { BlogMapper } from '../blogs/blog-mapper';

@Injectable()
export class PostMapper {
  constructor(
    private readonly blogMapper: BlogMapper,
    private readonly userMapper: UserMapper,
  ) {}
  toPostDto(post: PostDocument): GetPostDto {
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      images: post.images,
      tags: post.tags,
      blog: this.blogMapper.toBlogLigthDto(SafePopulated(post.blog)),
      user: this.userMapper.toUserDto(SafePopulated(post.user)),
    };
  }
  // toPostLightDto(post: PostDocument): PostLightDto {
  //   return {
  //     id: post._id.toString(),
  //     title: post.title,
  //   };
  // }
}
