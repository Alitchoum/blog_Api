import { Injectable } from '@nestjs/common';
import { BlogDocument } from './blog.schema';
import { GetBlogDto } from './dto/response/get-blog.dto';
import { UserMapper } from '../users/user.mapper';
import { SafePopulated } from '../_utils/functions/is-populated.function';
import { GetBlogLigthDto } from './dto/response/get-blog-ligth.dto';
import { MinioClientService } from '../minio-client/minio-client.service';
import { CategoryMapper } from '../category/category.mapper';

@Injectable()
export class BlogMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly minioClientService: MinioClientService,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async toBlogDto(blog: BlogDocument): Promise<GetBlogDto> {
    return {
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: await this.minioClientService.getPresignedUrl(blog.image),
      category: this.categoryMapper.toCategoryDto(SafePopulated(blog.category)),
      user: this.userMapper.toUserLightDto(SafePopulated(blog.user)),
    };
  }

  toBlogLigthDto(blog: BlogDocument): GetBlogLigthDto {
    return {
      id: blog._id.toString(),
      title: blog.title,
    };
  }
}
