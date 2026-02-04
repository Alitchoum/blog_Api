import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersRepository } from './users.repository';
import { UserMapper } from './user.mapper';
import { Blog, BlogSchema } from '../blogs/blog.schema';
import { Post, PostSchema } from '../posts/post.schema';
import { Comment, CommentSchema } from '../comments/comments.schema';
import { MinioClientModule } from '../minio-client/minio-client.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    MinioClientModule,
  ],

  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserMapper],
  exports: [UsersRepository, UsersService, UserMapper],
})
export class UsersModule {}
