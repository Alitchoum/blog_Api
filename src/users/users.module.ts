import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersRepository } from './users.repository';
import { UserMapper } from './user.mapper';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => BlogsModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserMapper],
  exports: [UsersService, UsersRepository, UserMapper],
})
export class UsersModule {}
