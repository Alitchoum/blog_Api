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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as UserSchema from '../users/user.schema';
import { GetCommentDto } from './dto/response/get-comment.dto';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Protect()
  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    type: GetCommentDto,
    description: 'Comment created with successfully',
  })
  @ApiOperation({ summary: 'Create a new comment' })
  createComment(
    @Body() body: CreateCommentDto,
    @ConnectedUser() user: UserSchema.UserDocument,
  ) {
    return this.commentsService.createComment(body, user.id);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  findAllComments() {
    return this.commentsService.findAllComments();
  }

  @Protect()
  @ApiOperation({ summary: 'Get comment by Id' })
  @Get(':commentId')
  findCommentById(@Param('commentId') commentId: string) {
    return this.commentsService.findCommentById(commentId);
  }

  @Protect()
  @ApiOperation({ summary: 'Update user comment by Id' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({
    type: GetCommentDto,
    description: 'Comment updated with successfully',
  })
  @Patch(':commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateData: UpdateCommentDto,
    @ConnectedUser() user: UserSchema.UserDocument,
  ) {
    return this.commentsService.updateComment(commentId, user.id, updateData);
  }

  @Protect()
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete User comment' })
  removeComment(
    @Param('commentId') commentId: string,
    @ConnectedUser() user: UserSchema.UserDocument,
  ) {
    return this.commentsService.removeComment(commentId, user.id);
  }
}
