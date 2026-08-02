import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { UpdatePostDto } from './dto/request/update-post.dto';

export interface CreatePostData {
  title: string;
  content: string;
  blogId: string;
  tags?: string[];
  images?: string[]; // URLs sous forme de string[]
}

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(
    data: CreatePostData,
    userId: string,
  ): Promise<PostDocument> {
    const createdPost = await this.postModel.create({
      title: data.title,
      content: data.content,
      images: data.images ?? [],
      tags: data.tags ?? [],
      blog: data.blogId,
      user: userId,
    });

    return await createdPost.populate([
      { path: 'blog', populate: { path: 'user' } },
      { path: 'user' },
    ]);
  }

  async findAllPosts(): Promise<PostDocument[]> {
    return await this.postModel
      .find()
      .populate([
        { path: 'blog', populate: { path: 'user' } },
        { path: 'user' },
      ])
      .exec();
  }

  async findByPostId(postId: string): Promise<PostDocument> {
    return await this.postModel
      .findById(postId)
      .orFail(new NotFoundException('Post not found'))
      .populate([
        { path: 'blog', populate: { path: 'user' } },
        { path: 'user' },
      ])
      .exec();
  }

  async findPostsByIds(postIds: string[]): Promise<PostDocument[]> {
    return await this.postModel
      .find({
        _id: { $in: postIds },
      })
      .populate([
        { path: 'blog', populate: { path: 'user' } },
        { path: 'user' },
      ])
      .exec();
  }

  async findPostsByBlogIds(blogIds: string[]): Promise<PostDocument[]> {
    return await this.postModel.find({ blog: { $in: blogIds } }).exec();
  }

  async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostDto,
  ): Promise<PostDocument> {
    return await this.postModel
      .findOneAndUpdate(
        { _id: postId, user: userId },
        { $set: updateData },
        { new: true },
      )
      .orFail(new NotFoundException('Post not found'))
      .populate([
        { path: 'blog', populate: { path: 'user' } },
        { path: 'user' },
      ])
      .exec();
  }

  async removePosts(postIds: string[], userId: string): Promise<void> {
    await this.postModel
      .deleteMany({
        _id: { $in: postIds },
        user: userId,
      })
      .exec();
  }

  async deletePostsByIds(postIds: string[]): Promise<void> {
    await this.postModel.deleteMany({ _id: { $in: postIds } }).exec();
  }

  async findPostByBlogId(blogId: string): Promise<PostDocument[]> {
    return await this.postModel
      .find({ blog: blogId })
      .populate([
        { path: 'blog', populate: { path: 'user' } },
        { path: 'user' },
      ])
      .exec();
  }
}
