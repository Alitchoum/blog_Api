import { Injectable } from '@nestjs/common';
import { BlogDocument } from './blog.schema';
import { GetBlogDto } from './dto/response/get-blog.dto';
import { UserMapper } from '../users/user.mapper';
import { SafePopulated } from '../_utils/functions/is-populated.function';
import { GetBlogLigthDto } from './dto/response/get-blog-ligth.dto';
import { MinioClientMapper } from '../minio-client/minio-client.mapper';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class BlogMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly minioClientService: MinioClientService,
  ) {}

  async toBlogDto(blog: BlogDocument): Promise<GetBlogDto> {
    return {
      id: blog._id.toString(),
      title: blog.title,
      description: blog.description,
      image: blog.image
        ? await this.minioClientService.getPresignedUrl(blog.image)
        : null,
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
