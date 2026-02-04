import {
  ForbiddenException,
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
import { Comment, CommentDocument } from '../comments/comments.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly blogsService: BlogsService,
    private readonly postMapper: PostMapper,
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
    const posts = await this.postModel
      .find()
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('No found posts'))
      .exec();
    return posts.map((post) => this.postMapper.toPostDto(post));
  }

  async findByPostId(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('Post not found'))
      .exec();
    return this.postMapper.toPostDto(post);
  }

  async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostDto,
  ): Promise<GetPostDto> {
    const updatedPost = await this.postModel
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
    return this.postMapper.toPostDto(updatedPost);
  }

  async removePost(postId: string, userId: string) {
    const post = await this.postModel
      .findOne({
        _id: postId,
        user: userId,
      })
      .orFail(new NotFoundException('Post not found'))
      .exec();
    if (post.images) {
      //add ici methode suppression image uploadService
    }
    //supprime tous les commentaires associés au post (incluant les autres users)
    await this.commentModel.deleteMany({ post: postId });
    //supprime le post
    await this.postModel.deleteOne({ _id: postId });
  }
}
