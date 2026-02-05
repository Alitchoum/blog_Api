import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCommentDto } from './dto/response/get-comment.dto';
import { Comment, CommentDocument } from './comments.schema';
import { CommentMapper } from './comment.mapper';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly commentMapper: CommentMapper,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<GetCommentDto> {
    const comment = await this.commentsRepository.createComment(
      createCommentDto,
      userId,
    );
    return this.commentMapper.toCommentDto(comment);
  }

  async findAllComments(): Promise<GetCommentDto[]> {
    const comments = await this.commentModel
      .find()
      .populate(['user', 'post'])
      .orFail(new NotFoundException('Comments not found'))
      .exec();
    return comments.map((comment) => this.commentMapper.toCommentDto(comment));
  }

  async findCommentById(commentId: string) {
    const comment = await this.commentModel
      .findById(commentId)
      .populate(['user', 'post'])
      .orFail(new NotFoundException('Comment not found'))
      .exec();
    return this.commentMapper.toCommentDto(comment);
  }

  async updateComment(
    commentId: string,
    userId: string,
    updateData: UpdateCommentDto,
  ): Promise<GetCommentDto> {
    const updatedComment = await this.commentModel
      .findOneAndUpdate(
        { _id: commentId, user: userId },
        { $set: updateData },
        { new: true },
      )
      .populate(['user', 'post'])
      .orFail(new NotFoundException('Comment not found'))
      .exec();

    return this.commentMapper.toCommentDto(updatedComment);
  }

  async removeComments(commentIds: string[], userId: string) {
    await this.commentsRepository.removeComments(commentIds, userId);
  }

  async removeCommentsByPostIds(postIds: string[]) {
    await this.commentsRepository.removeCommentsByPostIds(postIds);
  }
}
