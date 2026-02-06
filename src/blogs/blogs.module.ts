import { forwardRef, Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { UsersModule } from '../users/users.module';
import { BlogMapper } from './blog.mapper';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { BlogsRepository } from './blogs.repository';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => UsersModule),
    MinioClientModule,
    NestjsFormDataModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogMapper, BlogsRepository],
  exports: [BlogsService, BlogMapper, BlogsRepository],
})
export class BlogsModule {}
