import { Injectable } from '@nestjs/common';
import { UserMapper } from '../users/user.mapper';
import { GetEventDto } from './_utils/dto/response/get-event.dto';
import { PostMapper } from '../posts/post.mapper';
import { SafePopulated } from '../_utils/functions/is-populated.function';

@Injectable()
export class EventsMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly postMapper: PostMapper,
  ) {}

  toEventDto(event: any): GetEventDto {
    let targetUser;
    if (event.kind == 'LikePost') {
      targetUser = event.userLike;
    } else {
      targetUser = event.userComment;
    }
    return {
      id: event._id.toString(),
      kind: event.kind,
      createdAt: event.createdAt,
      post: this.postMapper.toPostLightDto(SafePopulated(event.post)),
      user: this.userMapper.toUserLightDto(SafePopulated(targetUser)),
    };
  }
}
