import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/request/create-blog.dto';
import { UpdateBlogDto } from './dto/request/update-blog.dto';
import { GetBlogDto } from './dto/response/get-blog.dto';
import { Blog, BlogDocument } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogMapper } from './blog.mapper';
import { unlink } from 'node:fs/promises';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly blogMapper: BlogMapper,
  ) {}

  async createBlog(dto: CreateBlogDto, userId: string): Promise<GetBlogDto> {
    const createBlog = await this.blogModel.create({
      title: dto.title,
      description: dto.description,
      image: dto.image ?? undefined,
      user: userId,
    });
    const blog = await createBlog.populate('user');
    return this.blogMapper.toBlogDto(blog);
  }

  async findAllBlogs(): Promise<GetBlogDto[]> {
    const blogs = await this.blogModel
      .find()
      .populate('user')
      .orFail(new NotFoundException('no blogs found'))
      .exec();

    return blogs.map((blog) => this.blogMapper.toBlogDto(blog));
  }

  async findBlogById(blogId: string) {
    const blog = await this.blogModel
      .findById(blogId)
      .populate('user')
      .orFail(new NotFoundException('blog does not exist'))
      .exec();
    return this.blogMapper.toBlogDto(blog);
  }

  async updateBlogById(
    blogId: string,
    userId: string,
    updateData: UpdateBlogDto,
  ): Promise<GetBlogDto> {
    const blog = await this.blogModel
      .findOneAndUpdate({ _id: blogId, user: userId }, updateData, {
        new: true,
      })
      .orFail(new ForbiddenException('Blog not found or unauthorized access'))
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
      try {
        await unlink(blog.image.slice(1));
      } catch {
        console.log('Image not found');
      }
    }
    await blog.deleteOne();
  }
}
