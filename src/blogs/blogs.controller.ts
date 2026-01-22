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
import { CreateBlogDto } from './dto/request/create-blog.dto';
import { UpdateBlogDto } from './dto/request/update-blog.dto';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetBlogDto } from './dto/response/get-blog.dto';
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
  @ApiAcceptedResponse({ type: GetBlogDto })
  createBlog(
    @Body() dto: CreateBlogDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.blogsService.createBlog(dto, user.id);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiAcceptedResponse({ type: GetBlogDto })
  findAllBlogs(): Promise<GetBlogDto[] | null> {
    return this.blogsService.findAllBlogs();
  }

  @Get(':blogId')
  @ApiOperation({ summary: 'Get blog by id' })
  @ApiAcceptedResponse({ type: GetBlogDto })
  findBlogById(@Param('blogId') blogId: string): Promise<GetBlogDto> {
    return this.blogsService.findBlogById(blogId);
  }

  @Protect()
  @Patch(':blogId')
  @ApiOperation({ summary: 'Update user blog (ref:id)' })
  @ApiAcceptedResponse({ type: GetBlogDto })
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
    console.log(blogId);
    return this.blogsService.removeBlogById(blogId, user.id);
  }
}
