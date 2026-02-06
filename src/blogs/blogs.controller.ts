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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/request/create-blog.dto';
import { UpdateBlogDto } from './dto/request/update-blog.dto';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetBlogDto } from './dto/response/get-blog.dto';
import { Protect } from '../auth/decorators/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as userSchema from '../users/user.schema';
import { FormDataRequest } from 'nestjs-form-data';
import { PaginatedQueryDto } from '../_utils/dtos/request/paginated-query.dtos';
import { GetBlogPaginatedDto } from './dto/response/get-blog-paginated.dto';

@ApiTags('Blog')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @Protect()
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create user blog' })
  @ApiBody({ type: CreateBlogDto })
  @ApiAcceptedResponse({ type: GetBlogDto })
  createBlog(
    @Body() dto: CreateBlogDto,
    @ConnectedUser() user: userSchema.UserDocument,
  ) {
    return this.blogsService.createBlog(dto, user._id);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiAcceptedResponse({ type: GetBlogPaginatedDto })
  findAllBlogs(
    @Query() query: PaginatedQueryDto,
  ): Promise<GetBlogPaginatedDto> {
    return this.blogsService.findAllBlogs(query);
  }

  @Get(':blogId')
  @ApiOperation({ summary: 'Get blog(s) by id' })
  @ApiAcceptedResponse({ type: [GetBlogDto] })
  findBlogsByIds(@Param('blogId') blogId: string): Promise<GetBlogDto[]> {
    return this.blogsService.findBlogsByIds([blogId]);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get blog(s) by user id' })
  @ApiAcceptedResponse({ type: [GetBlogDto] })
  findBlogsByUserId(@Param('userId') userId: string): Promise<GetBlogDto[]> {
    return this.blogsService.findBlogsByUserId(userId);
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
    return this.blogsService.removeBlogs([blogId], user.id);
  }
}
