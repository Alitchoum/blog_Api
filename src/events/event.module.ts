import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentPost, CommentPostSchema } from './schemas/comment-post.schema';
import { LikePost, LikePostSchema } from './schemas/like-post.schema';
import { EventSchema } from './schemas/event.schema';
import { EventsRepository } from './events.repository';
import { EventsService } from './events-service';
import { EventsMapper } from './events-mapper';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';
import { EventsController } from './events-controller';

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
    forwardRef(() => UsersModule),
    AuthModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, EventsMapper],
  exports: [EventsRepository],
})
export class EventsModule {}
