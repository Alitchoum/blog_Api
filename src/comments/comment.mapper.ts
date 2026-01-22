import { Injectable } from '@nestjs/common';
import { CommentDocument } from './comments.schema';
import { GetCommentDto } from './dto/response/get-comment.dto';
import { UserMapper } from '../users/user.mapper';
import { SafePopulated } from '../_utils/functions/is-populated.function';
import { PostMapper } from '../posts/post.mapper';

@Injectable()
export class CommentMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly PostMapper: PostMapper,
  ) {}

  toCommentDto(comment: CommentDocument): GetCommentDto {
    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      user: this.userMapper.toUserLightDto(SafePopulated(comment.user)),
      post: this.PostMapper.toPostLightDto(SafePopulated(comment.post)),
    };
  }
}
