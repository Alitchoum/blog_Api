import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as userSchema from '../users/user.schema';

@ApiTags('  Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Protect()
  @Post()
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse() // a ajouter ou non ici ?
  @ApiOperation({ summary: 'Create a new post' })
  createPost(
    @Body() dto: CreatePostDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.postsService.createPost(dto, user.id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
