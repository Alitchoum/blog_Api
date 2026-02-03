import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/request/create-blog.dto';
import { UpdateBlogDto } from './dto/request/update-blog.dto';
import { GetBlogDto } from './dto/response/get-blog.dto';
import { Blog, BlogDocument } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlogMapper } from './blog.mapper';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BlogsRepository } from './blogs.repository';
import { MinioClientMapper } from '../minio-client/minio-client.mapper';
import { PaginatedQueryDto } from '../_utils/dtos/paginated-query.dtos';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly blogMapper: BlogMapper,
    private readonly blogsRepository: BlogsRepository,
    private readonly minioClientService: MinioClientService,
  ) {}

  async createBlog(
    dto: CreateBlogDto,
    userId: Types.ObjectId,
  ): Promise<GetBlogDto> {
    const blogId = new Types.ObjectId(); //genere un id pour blog
    const key = MinioClientMapper.getBlogImageKey(blogId.toString());

    if (dto.image) {
      await this.minioClientService.uploadFile(dto.image, key);
    }

    const createdBlog: Partial<BlogDocument> = {
      _id: blogId,
      title: dto.title,
      description: dto.description,
      image: key,
      user: userId,
    };

    const blog = await this.blogsRepository.createBlog(createdBlog);
    return await this.blogMapper.toBlogDto(blog);
  }

  async findAllBlogs(query: PaginatedQueryDto): Promise<GetBlogDto[]> {
    const blogs = await this.blogsRepository.findAllBlogs(query);

    //Pour attendre le retour de toutes les promesses (async toBlogDto)
    return Promise.all(blogs.map((blog) => this.blogMapper.toBlogDto(blog)));
  }

  async findBlogById(blogId: string) {
    const blog = await this.blogsRepository.findBlogById(blogId);
    return this.blogMapper.toBlogDto(blog);
  }

  async updateBlogById(
    blogId: string,
    userId: string,
    updateData: UpdateBlogDto,
  ): Promise<GetBlogDto> {
    const blog = await this.blogModel
      .findOneAndUpdate(
        { _id: blogId, user: userId },
        { $set: updateData },
        {
          new: true,
        },
      )
      .orFail(new NotFoundException('Blog not found'))
      .populate('user')
      .exec();

    return this.blogMapper.toBlogDto(blog);
  }

  async removeBlogById(blogId: string, userId: string) {
    const blog = await this.blogModel
      .findOne({ _id: blogId, user: userId })
      .orFail(new NotFoundException('Blog not found'))
      .exec();

    if (blog.image) {
      await this.minioClientService.deleteFile(blog.image);
    }
    await blog.deleteOne();
  }
}
