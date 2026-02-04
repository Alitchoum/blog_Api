import { Injectable } from '@nestjs/common';
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
import { Post, PostDocument } from '../posts/post.schema';
import { Comment, CommentDocument } from '../comments/comments.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly blogMapper: BlogMapper,
    private readonly blogsRepository: BlogsRepository,
    private readonly minioClientService: MinioClientService,
  ) {}

  //CREATE BLOG
  async createBlog(
    dto: CreateBlogDto,
    userId: Types.ObjectId,
  ): Promise<GetBlogDto> {
    const blogId = new Types.ObjectId(); //genere un id pour blog
    let key: string | undefined;

    if (dto.image) {
      key = MinioClientMapper.getBlogImageKey(blogId.toString());
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

  //GET ALL BLOG
  async findAllBlogs(query: PaginatedQueryDto): Promise<GetBlogDto[]> {
    const blogs = await this.blogsRepository.findAllBlogs(query);

    //Pour attendre le retour de toutes les promesses (async toBlogDto)
    return Promise.all(blogs.map((blog) => this.blogMapper.toBlogDto(blog)));
  }

  //GET BY ID
  async findBlogById(blogId: string) {
    const blog = await this.blogsRepository.findBlogById(blogId);
    return this.blogMapper.toBlogDto(blog);
  }

  //UPDATE BLOG
  async updateBlogById(
    blogId: string,
    userId: string,
    updateData: UpdateBlogDto,
  ): Promise<GetBlogDto> {
    let newImageKey: string | undefined;

    // upload si image + transforme en string (key)
    if (updateData.image) {
      newImageKey = MinioClientMapper.getBlogImageKey(blogId);
      await this.minioClientService.uploadFile(updateData.image, newImageKey);
    }

    const blog = await this.blogsRepository.updateBlogById(
      blogId,
      userId,
      updateData,
      newImageKey,
    );
    return this.blogMapper.toBlogDto(blog);
  }

  //DELETE BLOG
  async removeBlogById(blogId: string, userId: string) {
    const blog = await this.blogsRepository.removeBlogById(blogId, userId);

    if (blog.image) {
      await this.minioClientService.deleteImage(blog.image);
    }
  }
}
