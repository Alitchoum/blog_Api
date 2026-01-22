import { Injectable } from '@nestjs/common';
import { BlogDocument } from './blog.schema';
import { GetBlogDto } from './dto/response/get-blog.dto';
import { UserMapper } from '../users/user.mapper';
import { SafePopulated } from '../_utils/is-populated.function';
import { BlogLigthDto } from './dto/response/blog-ligth.dto';

@Injectable()
export class BlogMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toBlogDto(blog: BlogDocument): GetBlogDto {
    return {
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image,
      user: this.userMapper.toUserLightDto(SafePopulated(blog.user)),
    };
  }

  toBlogLigthDto(blog: BlogDocument): BlogLigthDto {
    return {
      id: blog._id.toString(),
      title: blog.title,
    };
  }
}
