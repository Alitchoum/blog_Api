import { Comment, CommentDocument } from './comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/request/create-comment.dto';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    const newComment = await this.commentModel.create({
      content: createCommentDto.content,
      user: userId,
      post: createCommentDto.postId,
    });

    return await this.commentModel
      .findById(newComment._id)
      .orFail(new NotFoundException('Comment not found'))
      .populate(['user', 'post'])
      .exec();
  }

  async removeComments(
    commentIds: string[],
    userId: string,
  ): Promise<DeleteResult> {
    return this.commentModel
      .deleteMany({ _id: { $in: commentIds }, user: userId })
      .exec();
  }

  //DELETE COMMENTS IN OTHER POST
  async removeCommentsByUserId(userId: string): Promise<DeleteResult> {
    return this.commentModel.deleteMany({ user: userId }).exec();
  }

  //DELETE CASCADE
  async removeCommentsByPostIds(postIds: string[]): Promise<DeleteResult> {
    return this.commentModel.deleteMany({ post: { $in: postIds } }).exec();
  }
}
