import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { CreatePostDto } from './dto/request/create-post.dto';
import { GetPostDto } from './dto/response/get-post.dto';

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<PostDocument> {
    const createdPost = await this.postModel.create({
      title: createPostDto.title,
      content: createPostDto.content,
      images: createPostDto.images,
      tags: createPostDto.tags,
      blog: createPostDto.blogId,
      user: userId,
    });
    return await this.postModel
      .findById(createdPost._id)
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('Post not found'))
      .exec();
  }

  async findAllPosts(): Promise<PostDocument[]> {
    return await this.postModel
      .find()
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('No found posts'))
      .exec();
  }

  async findByPostId(postId: string) {
    return await this.postModel
      .findById(postId)
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('Post not found'))
      .exec();
  }

  async findPostsByBlogIds(blogIds: string[]) {
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
        {
          new: true,
        },
      )
      .orFail(new NotFoundException('Post not found'))
      .populate('user')
      .populate({ path: 'blog', populate: { path: 'user' } })
      .exec();
  }

  async removePosts(postIds: string[], userId: string) {
    await this.postModel
      .deleteMany({
        _id: { $in: postIds },
        user: userId,
      })
      .exec();
  }

  async deletePostsByIds(postIds: string[]) {
    await this.postModel.deleteMany({ _id: { $in: postIds } }).exec();
  }
}
