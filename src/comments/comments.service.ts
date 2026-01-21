import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDto } from './dto/comment.dto';
import { Comment, CommentDocument } from './comments.schema';
import { CommentMapper } from './comment-mapper';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly commentMapper: CommentMapper,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    userID: string,
  ): Promise<CommentDto> {
    const createdComment = await this.commentModel.create({
      content: dto.content,
      user: userID,
      post: dto.postId,
    });
    const comment = await createdComment.populate(['user', 'post']);
    return this.commentMapper.toCommentDto(comment);
  }

  // findAll() {
  //   return `This action returns all comments`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} comment`;
  // }
  //
  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} comment`;
  // }
}
