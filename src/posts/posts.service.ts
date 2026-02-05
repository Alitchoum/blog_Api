import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { GetPostDto } from './dto/response/get-post.dto';
import { BlogsService } from '../blogs/blogs.service';
import { PostMapper } from './post.mapper';
import { CommentsService } from '../comments/comments.service';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly blogsService: BlogsService,
    private readonly postMapper: PostMapper,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPost(dto: CreatePostDto, userId: string): Promise<GetPostDto> {
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
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('Post not found'))
      .exec();
    return this.postMapper.toPostDto(post);
  }

  async findAllPosts(): Promise<GetPostDto[]> {
    const posts = await this.postsRepository.findAllPosts();
    return posts.map((post) => this.postMapper.toPostDto(post));
  }

  async findByPostId(postId: string) {
    const post = await this.postsRepository.findByPostId(postId);
    return this.postMapper.toPostDto(post);
  }

  async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostDto,
  ): Promise<GetPostDto> {
    const updatedPost = await this.postsRepository.updatePost(
      postId,
      userId,
      updateData,
    );
    return this.postMapper.toPostDto(updatedPost);
  }

  async removePosts(postIds: string[], userId: string) {
    await this.postsRepository.removePosts(postIds, userId);
  }

  async removePostsByBlogId(blogIds: string[]) {
    await this.postsRepository.removePostsByBlogId(blogIds);
  }
}
