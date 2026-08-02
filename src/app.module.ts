import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { EnvironmentVariables, validateEnv } from './_utils/config/env.config';
import { MinioClientModule } from './minio-client/minio-client.module';
import { HttpModule } from '@nestjs/axios';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        uri: configService.get('MONGODB_URL'),
      }),
    }),

    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile, // fichiers légers stockés en mémoire
      cleanupAfterSuccessHandle: true,
      cleanupAfterFailedHandle: true,
      limits: {
        files: Number(process.env.UPLOAD_MAX_FILES) || 5,
        fileSize:
          (Number(process.env.UPLOAD_MAX_FILES_SIZE_MB) || 10) * 1024 * 1024,
      },
    }),

    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    MinioClientModule,
    CategoryModule,
  ],
})
export class AppModule {}
