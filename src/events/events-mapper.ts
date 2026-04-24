import { Injectable } from '@nestjs/common';
import { UserMapper } from '../users/user.mapper';
import { PostMapper } from '../posts/post.mapper';
import { SafePopulated } from '../_utils/functions/is-populated.function';
import { EventUnion } from './_utils/all-events.type';
import { LikePostDocument } from './schemas/like-post.schema';
import { CommentPostDocument } from './schemas/comment-post.schema';
import { GetEventUserLikeDto } from './_utils/dto/response/get-event-user-like.dto';
import { GetEventUserCommentDto } from './_utils/dto/response/get-event-user-comment.dto';
import { GetEventUnionDto } from './_utils/dto/get-events-paginated.dto';

@Injectable()
export class EventsMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly postMapper: PostMapper,
  ) {}

  toGetEventUserLikeDto(event: LikePostDocument): GetEventUserLikeDto {
    return {
      id: event._id.toString(),
      kind: event.kind,
      createdAt: event.createdAt,
      post: this.postMapper.toPostLightDto(SafePopulated(event.post)),
      userLike: this.userMapper.toUserLightDto(SafePopulated(event.userLike)),
    };
  }

  toGetEventUserCommentDto(event: CommentPostDocument): GetEventUserCommentDto {
    return {
      id: event._id.toString(),
      kind: event.kind,
      createdAt: event.createdAt,
      post: this.postMapper.toPostLightDto(SafePopulated(event.post)),
      userComment: this.userMapper.toUserLightDto(
        SafePopulated(event.userComment),
      ),
    };
  }

  toEventDto(event: EventUnion): GetEventUnionDto {
    switch (event.kind) {
      case 'LIKE_POST':
        return this.toGetEventUserLikeDto(event);
      case 'COMMENT_POST':
        return this.toGetEventUserCommentDto(event);
    }
  }
}
