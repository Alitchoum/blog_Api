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
import { PostsRepository } from './posts.repository';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly postsRepository: PostsRepository,
    @Inject(forwardRef(() => BlogsService))
    private readonly blogsService: BlogsService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    private readonly postMapper: PostMapper,
  ) {}

  async createPost(dto: CreatePostDto, userId: string): Promise<GetPostDto> {
    const blogs = await this.blogsService.findBlogsByIds([dto.blogId]);
    const blog = blogs[0];

    if (blog.user.id !== userId) {
      throw new ForbiddenException('Blog not found');
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
    await this.commentsService.removeCommentsByPostIds(postIds);
    await this.postsRepository.removePosts(postIds, userId);
  }

  async removePostsByBlogId(blogIds: string[]) {
    const posts = await this.postsRepository.findPostsByBlogIds(blogIds);
    const postIds = posts.map((post) => post._id.toString());

    await this.commentsService.removeCommentsByPostIds(postIds);
    await this.postsRepository.deletePostsByIds(postIds);
  }
}
