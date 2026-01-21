import { Injectable } from '@nestjs/common';
import { BlogDocument } from './blog.schema';
import { BlogDto } from './dto/blog.dto';
import { UserMapper } from '../users/user-mapper';
import { SafePopulated } from '../_utils/is-populated.function';
import { BlogLigthDto } from './dto/blog-ligth.dto';

@Injectable()
export class BlogMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toBlogDto(blog: BlogDocument): BlogDto {
    return {
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image,
      user: this.userMapper.toUserDto(SafePopulated(blog.user)),
    };
  }

  toBlogLigthDto(blog: BlogDocument): BlogLigthDto {
    return {
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image,
    };
  }
}
