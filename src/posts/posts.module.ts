import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { BlogsModule } from '../blogs/blogs.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PostMapper } from './post.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    BlogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostMapper],
  exports: [PostMapper],
})
export class PostsModule {}
