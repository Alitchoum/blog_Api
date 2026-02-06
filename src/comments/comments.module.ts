import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comments.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CommentMapper } from './comment.mapper';
import { PostsModule } from '../posts/posts.module';
import { CommentsRepository } from './comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => UsersModule),
    AuthModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentMapper, CommentsRepository],
  exports: [CommentMapper, CommentsService, CommentsRepository],
})
export class CommentsModule {}
