import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogDto } from './dto/blog.dto';
import { Blog, BlogDocument } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogMapper } from './blog-mapper';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly blogMapper: BlogMapper,
  ) {}

  async createBlog(dto: CreateBlogDto, userId: string): Promise<BlogDto> {
    const createBlog = await this.blogModel.create({
      title: dto.title,
      description: dto.description,
      image: dto.image ?? undefined,
      user: userId,
    });
    const blog = await createBlog.populate('user');
    return this.blogMapper.toBlogDto(blog);
  }

  async findAllBlogs(): Promise<BlogDto[]> {
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
  ): Promise<BlogDto> {
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
    await this.blogModel
      .findOneAndDelete({ _id: blogId, user: userId })
      .orFail(new ForbiddenException('Blog not found or unauthorized access'))
      .exec();
  }
}
