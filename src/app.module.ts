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

    NestjsFormDataModule.configAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: MemoryStoredFile, //petits fichiers (legers)
        isGlobal: true,
        cleanupAfterSuccessHandle: true,
        cleanupAfterFailedHandle: true,
        limits: {
          files: configService.get('UPLOAD_MAX_FILES'),
          fileSize: configService.get('UPLOAD_MAX_FILES_SIZE_MB') * 1024 * 1024,
        },
      }),
    }),
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    MinioClientModule,
  ],
})
export class AppModule {}
