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
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/decorators/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as userSchema from '../users/user.schema';
import { GetPostDto } from './dto/response/get-post.dto';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //CREATE
  @Protect()
  @Post()
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    type: GetPostDto,
    description: 'Post created with successfully',
  })
  @ApiOperation({ summary: 'Create a new post' })
  createPost(
    @Body() dto: CreatePostDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.postsService.createPost(dto, user.id);
  }

  //GET ALL
  @Protect()
  @Get()
  @ApiOkResponse({ type: GetPostDto })
  @ApiOperation({ summary: 'Get all posts' })
  findAllPosts() {
    return this.postsService.findAllPosts();
  }

  //GET ID
  @Protect()
  @Get(':postId')
  @ApiOkResponse({ type: GetPostDto })
  @ApiOperation({ summary: 'Get post by id' })
  @ApiQuery({ name: 'lang' })
  findPostById(@Param('postId') postId: string, @Query('lang') lang?: string) {
    return this.postsService.findByPostId(postId, lang);
  }

  //UPDATE
  @Protect()
  @Patch(':postId')
  @ApiOperation({ summary: 'Update user post by id' })
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ type: GetPostDto })
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
    return this.postsService.removePosts([postId], user.id);
  }

  @Get('translate')
  @ApiOperation({ summary: 'Translate DeepL' })
  @ApiQuery({ name: 'text' })
  async translatePost(
    @Query('title') title: string,
    @Query('content') content: string,
    @Query('tags') tags: string[],
    @Query('lang') lang: string,
  ) {
    return this.postsService.translatePost(title, content, tags, lang);
  }
}
