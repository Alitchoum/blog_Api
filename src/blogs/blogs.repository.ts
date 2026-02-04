import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument } from './blog.schema';
import { Model } from 'mongoose';
import { PaginatedQueryDto } from '../_utils/dtos/paginated-query.dtos';
import { Post, PostDocument } from '../posts/post.schema';
import { Comment, CommentDocument } from '../comments/comments.schema';
import { UpdateBlogDto } from './dto/request/update-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
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

  findBlogById(blogId: string) {
    return this.blogModel
      .findById(blogId)
      .populate('user')
      .orFail(new NotFoundException('No blog found'))
      .exec();
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

  async removeBlogById(blogId: string, userId: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOne({ _id: blogId, user: userId })
      .orFail(new NotFoundException('Blog not found'))
      .exec();

    const posts = await this.postModel.find({ blog: blogId });
    const postIds = posts.map((post) => post._id.toString());

    console.log('IDs des posts :', postIds);
    await Promise.all([
      this.commentModel.deleteMany({ post: { $in: postIds } }), // Supprime les comments de tous les posts lié au blog
      this.postModel.deleteMany({ blog: blogId }),
      this.blogModel.deleteOne({ _id: blogId }),
    ]);

    return blog;
  }
}
