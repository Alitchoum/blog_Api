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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BlogDto } from './dto/blog.dto';
import { Protect } from '../auth/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as userSchema from '../users/user.schema';

@ApiTags('Blog')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @Protect()
  @ApiOperation({ summary: 'Create user blog' })
  @ApiBody({ type: CreateBlogDto })
  @ApiAcceptedResponse({ type: BlogDto })
  createBlog(
    @Body() dto: CreateBlogDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.blogsService.createBlog(dto, user.id);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiAcceptedResponse({ type: BlogDto })
  findAllBlogs(): Promise<BlogDto[] | null> {
    return this.blogsService.findAllBlogs();
  }

  @Get(':blogId')
  @ApiOperation({ summary: 'Get blog by id' })
  @ApiAcceptedResponse({ type: BlogDto })
  findBlogById(@Param('blogId') blogId: string): Promise<BlogDto> {
    return this.blogsService.findBlogById(blogId);
  }

  @Protect()
  @Patch(':blogId')
  @ApiOperation({ summary: 'Update user blog (ref:id)' })
  @ApiAcceptedResponse({ type: BlogDto })
  @ApiBody({ type: UpdateBlogDto })
  updateBlogById(
    @Param('blogId') blogId: string,
    @Body() updateData: UpdateBlogDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.blogsService.updateBlogById(blogId, user.id, updateData);
  }

  @Protect()
  @Delete(':blogId')
  @ApiOperation({ summary: 'Delete blog by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAcceptedResponse()
  removeBlogById(
    @Param('blogId') blogId: string,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.blogsService.removeBlogById(blogId, user.id);
  }
}
