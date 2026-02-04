import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { UsersModule } from '../users/users.module';
import { BlogMapper } from './blog.mapper';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { BlogsRepository } from './blogs.repository';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Comment, CommentSchema } from '../comments/comments.schema';
import { Post, PostSchema } from '../posts/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UsersModule,
    MinioClientModule,
    NestjsFormDataModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogMapper, BlogsRepository],
  exports: [BlogsService, BlogMapper],
})
export class BlogsModule {}
