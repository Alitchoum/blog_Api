import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blogs/blog.schema';
import { Comment, CommentDocument } from '../comments/comments.schema';
import { Post } from '../posts/post.schema';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<CommentDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly minioClientService: MinioClientService,
  ) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findUserById(userId: string): Promise<UserDocument> {
    return this.userModel
      .findById(userId)
      .orFail(new NotFoundException('user not found'))
      .exec();
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .orFail(new NotFoundException('user not found'))
      .exec();
  }

  async deleteUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ _id: userId })
      .orFail(new NotFoundException('user not found'))
      .exec();

    const blogs = await this.blogModel.find({ user: userId });
    if (blogs.length > 0) {
      for (const blog of blogs) {
        if (blog.image) {
          await this.minioClientService.deleteImage(blog.image);
        }
      }
    }

    const blogIds = blogs.map((blog) => blog._id.toString());

    const posts = await this.postModel.find({ blog: { $in: blogIds } });
    const postIds = posts.map((post) => post._id.toString());

    await Promise.all([
      this.commentModel.deleteMany({ user: userId }),
      this.commentModel.deleteMany({ post: { $in: postIds } }),
      this.postModel.deleteMany({ blog: { $in: blogIds } }),
      this.blogModel.deleteMany({ user: userId }),
      this.userModel.deleteOne({ _id: userId }),
    ]);
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
