import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';
import { PaginatedQueryDto } from '../_utils/dtos/request/paginated-query.dtos';
import { UpdateBlogDto } from './dto/request/update-blog.dto';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly postsService: PostsService,
  ) {}

  async createBlog(data: Partial<BlogDocument>): Promise<BlogDocument> {
    const newBlog = await this.blogModel.create(data);
    return await newBlog.populate('user');
  }

  async findAllBlogs(query: PaginatedQueryDto): Promise<BlogDocument[]> {
    return await this.blogModel
      .find()
      .sort(query.toMongoDbSort)
      .collation({ locale: 'fr', strength: 1 }) // locale: choix langue / strength: ignore la casse
      .skip(query.skip)
      .limit(query.limit)
      .populate('user')
      .orFail(new NotFoundException('no blogs found'))
      .exec();
  }

  findBlogsByIds(blogIds: string[]): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ _id: { $in: blogIds } })
      .populate('user')
      .orFail(new NotFoundException('No blog found'))
      .exec();
  }

  findBlogsByUserId(userId: string): Promise<BlogDocument[]> {
    return this.blogModel.find({ user: userId }).populate('user').exec();
  }

  updateBlogById(
    blogId: string,
    userId: string,
    updateData: UpdateBlogDto,
    imageKey?: string,
  ): Promise<BlogDocument> {
    return this.blogModel
      .findOneAndUpdate(
        { _id: blogId, user: userId },
        {
          $set: {
            title: updateData.title,
            description: updateData.description,
            image: imageKey,
          },
        },
        {
          new: true,
        },
      )
      .orFail(new NotFoundException('Blog not found'))
      .populate('user')
      .exec();
  }

  async removeBlogs(blogIds: string[], userId: string) {
    await this.blogModel
      .deleteMany({ _id: { $in: blogIds }, user: userId })
      .exec();
  }
}
