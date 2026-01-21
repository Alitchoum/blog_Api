import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Protect } from '../auth/protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import * as UserSchema from '../users/user.schema';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Protect()
  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiOperation({ summary: 'Create a new comment' })
  createComment(
    @Body() body: CreateCommentDto,
    @ConnectedUser() user: UserSchema.UserDocument,
  ) {
    return this.commentsService.createComment(body, user.id);
  }

  // @Get()
  // findAll() {
  //   return this.commentsService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentsService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentsService.update(id, updateCommentDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentsService.remove(id);
  // }
}
