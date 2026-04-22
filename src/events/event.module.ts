import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentPost, CommentPostSchema } from './comment-post.schema';
import { LikePost, LikePostSchema } from './like-post.schema';
import { EventSchema } from './event.schema';
import { EventsRepository } from './events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          { name: CommentPost.name, schema: CommentPostSchema },
          { name: LikePost.name, schema: LikePostSchema },
        ],
      },
    ]),
  ],
  providers: [EventsRepository],
  exports: [EventsRepository],
})
export class EventsModule {}
