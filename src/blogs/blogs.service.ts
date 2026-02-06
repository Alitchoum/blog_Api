import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { PaginatedQueryDto } from '../_utils/dtos/request/paginated-query.dtos';
import { GetBlogPaginatedDto } from './dto/response/get-blog-paginated.dto';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly blogMapper: BlogMapper,

    @Inject(forwardRef(() => BlogsRepository))
    private readonly blogsRepository: BlogsRepository,

    private readonly minioClientService: MinioClientService,

    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
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
  async findAllBlogs(query: PaginatedQueryDto): Promise<GetBlogPaginatedDto> {
    const blogs = await this.blogsRepository.findAllBlogs(query);

    const total = await this.blogModel.countDocuments().exec(); //natif pour compter nombre d'objets

    //Pour attendre le retour de toutes les promesses (async toBlogDto)
    const blogDtos = await Promise.all(
      blogs.map((blog) => this.blogMapper.toBlogDto(blog)),
    );
    return new GetBlogPaginatedDto(query, total, blogDtos);
  }

  //GET BY ID
  async findBlogsByIds(blogIds: string[]): Promise<GetBlogDto[]> {
    const blogs = await this.blogsRepository.findBlogsByIds(blogIds);
    return await Promise.all(
      blogs.map((blog) => this.blogMapper.toBlogDto(blog)),
    );
  }

  //GET BLOGS BY USER ID
  async findBlogsByUserId(userId: string): Promise<GetBlogDto[]> {
    const blogs = await this.blogsRepository.findBlogsByUserId(userId);
    return await Promise.all(
      blogs.map((blog) => this.blogMapper.toBlogDto(blog)),
    );
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

  //DELETE USER BLOGS
  async removeBlogs(blogIds: string[], userId: string) {
    const blogs = await this.blogsRepository.findBlogsByIds(blogIds);

    const imageKeys = blogs
      .map((blog) => blog.image)
      .filter((image): image is string => !!image); //pas tenir compte de undefined /null

    if (imageKeys.length > 0) {
      await this.minioClientService.deleteImages(imageKeys);
    }
    await this.postsService.removePostsByBlogId(blogIds);
    await this.blogsRepository.removeBlogs(blogIds, userId);
  }
}
