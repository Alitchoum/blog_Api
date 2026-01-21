import { Injectable } from '@nestjs/common';
import { CommentDocument } from './comments.schema';
import { CommentDto } from './dto/comment.dto';
import { UserMapper } from '../users/user-mapper';
import { SafePopulated } from '../_utils/is-populated.function';
import { PostMapper } from '../posts/post.mapper';

@Injectable()
export class CommentMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly PostMapper: PostMapper,
  ) {}
  toCommentDto(comment: CommentDocument): CommentDto {
    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      user: this.userMapper.toUserDto(SafePopulated(comment.user)),
      post: this.PostMapper.toPostDto(SafePopulated(comment.post)),
    };
  }
}
