import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from './post.schema';
import { PostDto } from './dto/post.dto';
import { BlogsService } from '../blogs/blogs.service';

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
    const post = await createdPost.populate(['user', 'blog']);
    return PostDto.toPostDto(post);
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
