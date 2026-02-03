import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';
import { PaginatedQueryDto } from '../_utils/dtos/paginated-query.dtos';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async createBlog(data: Partial<BlogDocument>): Promise<BlogDocument> {
    const newBlog = await this.blogModel.create(data);
    return await newBlog.populate('user');
  }

  async findAllBlogs(query: PaginatedQueryDto): Promise<BlogDocument[]> {
    return await this.blogModel
      .find()
      .sort(query.toMongoDbSort)
      .skip(query.skip)
      .limit(query.limit)
      .populate('user')
      .orFail(new NotFoundException('no blogs found'))
      .exec();
  }

  findBlogById(blogId: string) {
    return this.blogModel
      .findById(blogId)
      .populate('user')
      .orFail(new NotFoundException('No blog found'))
      .exec();
  }
}
