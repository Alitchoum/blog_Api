import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { PostDto } from './dto/post.dto';
import { BlogsService } from '../blogs/blogs.service';
import { BlogDto } from '../blogs/dto/blog.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly blogsService: BlogsService,
  ) {}

  async createPost(dto: CreatePostDto, userId: string): Promise<PostDto> {
    const blog = await this.blogsService.findBlogById(dto.blogId);
    if (blog.user.id !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }
    const createdPost = await this.postModel.create({
      title: dto.title,
      content: dto.content,
      images: dto.images,
      tags: dto.tags,
      blog: dto.blogId,
      user: userId,
    });
    const post = await this.postModel
      .findById(createdPost._id)
      .populate('user') // user du post
      .populate({ path: 'blog', populate: { path: 'user' } }) //Charge blog et son user associé (objet)
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return PostDto.toPostDto(post);
  }

  async findAllPosts(): Promise<PostDto[]> {
    const posts = await this.postModel
      .find()
      .populate('user')
      .populate({ path: 'blog', populate: { path: 'user' } })
      .orFail(new NotFoundException('No found posts'))
      .exec();
    return posts.map((post) => PostDto.toPostDto(post));
  }

  async findByPostId(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('user')
      .populate({ path: 'blog', populate: { path: 'user' } })
      .orFail(new NotFoundException('Post not found'))
      .exec();
    return PostDto.toPostDto(post);
  }

  async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostDto,
  ): Promise<PostDto> {
    const updatedPost = await this.postModel
      .findOneAndUpdate({ _id: postId, user: userId }, updateData, {
        new: true,
      })
      .orFail(new NotFoundException('Post not found'))
      .populate('user')
      .populate({ path: 'blog', populate: { path: 'user' } })
      .exec();
    return PostDto.toPostDto(updatedPost);
  }

  async removePost(postId: string, userId: string) {
    return await this.postModel
      .findOneAndDelete({
        _id: postId,
        user: userId,
      })
      .orFail(new NotFoundException('Post not found'))
      .exec();
  }
}
