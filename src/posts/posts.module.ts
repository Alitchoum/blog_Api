import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { BlogsModule } from '../blogs/blogs.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PostMapper } from './post.mapper';
import { CommentsModule } from '../comments/comments.module';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => BlogsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostMapper, PostsRepository],
  exports: [PostsService, PostMapper, PostsRepository],
})
export class PostsModule {}
