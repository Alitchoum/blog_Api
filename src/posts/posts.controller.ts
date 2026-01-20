import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as userSchema from '../users/user.schema';
import { PostDto } from './dto/post.dto';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Protect()
  @Post()
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    type: PostDto,
    description: 'Post created with successfully',
  })
  @ApiOperation({ summary: 'Create a new post' })
  createPost(
    @Body() dto: CreatePostDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.postsService.createPost(dto, user.id);
  }

  @Protect()
  @Get()
  @ApiOkResponse({ type: PostDto })
  @ApiOperation({ summary: 'Get all posts' })
  findAllPosts() {
    return this.postsService.findAllPosts();
  }

  @Protect()
  @Get(':postId')
  @ApiOkResponse({ type: PostDto })
  @ApiOperation({ summary: 'Get post by id' })
  findPostById(@Param('postId') postId: string) {
    return this.postsService.findByPostId(postId);
  }

  @Protect()
  @Patch(':postId')
  @ApiOperation({ summary: 'Update user post by id' })
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ type: PostDto })
  updatePost(
    @Param('postId') postId: string,
    @ConnectedUser() user: userSchema.UserDocument,
    @Body() updateData: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, user.id, updateData);
  }

  @Protect()
  @Delete(':postId')
  @ApiOperation({ summary: 'Delete user post by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removePost(
    @Param('postId') postId: string,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.postsService.removePost(postId, user.id);
  }
}
