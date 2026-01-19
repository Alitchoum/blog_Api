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
import { UserDto } from '../users/dto/user.dto';
import { SafePopulated } from '../_utils/is-populated.function';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async createBlog(dto: CreateBlogDto, userId: string): Promise<BlogDto> {
    const createBlog = await this.blogModel.create({
      title: dto.title,
      description: dto.description,
      image: dto.image,
      user: userId,
    });
    const blog = await createBlog.populate('user');
    return this.toBlogDto(blog);
  }

  async findAllBlogs(): Promise<BlogDto[]> {
    const blogs = await this.blogModel
      .find()
      .populate('user')
      .orFail(new NotFoundException('no blogs found'))
      .exec();

    return blogs.map((blog) => this.toBlogDto(blog));
  }

  async findBlogById(blogId: string) {
    const blog = await this.blogModel
      .findById(blogId)
      .populate('user')
      .orFail(new NotFoundException('blog does not exist'))
      .exec();
    return this.toBlogDto(blog);
  }

  async updateBlogById(
    blogId: string,
    userId: string,
    updateData: UpdateBlogDto,
  ): Promise<BlogDto> {
    const blog = await this.blogModel
      .findOneAndUpdate({ blogId, userId }, updateData, { new: true })
      .orFail(new ForbiddenException('blog does not exist'))
      .populate('user')
      .exec();
    return this.toBlogDto(blog);
  }

  async removeBlogById(blogId: string, userId: string) {
    const blog = await this.blogModel
      .findByIdAndDelete(blogId)
      .orFail(new ForbiddenException('blog not found'))
      .populate('user')
      .exec();
    return await this.blogModel.findByIdAndDelete(blog).exec();
  }

  toBlogDto(blog: BlogDocument): BlogDto {
    return {
      id: blog.id,
      title: blog.title,
      description: blog.description,
      image: blog.image,
      user: UserDto.toUserDto(SafePopulated(blog.user)),
    };
  }
}
