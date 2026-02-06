import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetUserDto } from './dto/response/get-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './user.mapper';
import { BlogsService } from '../blogs/blogs.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly blogsService: BlogsService,
  ) {}

  async findAllUser(): Promise<GetUserDto[]> {
    const users = await this.usersRepository.findAllUsers();
    return users.map((user) => this.userMapper.toUserDto(user));
  }

  async findUserById(userId: string): Promise<GetUserDto> {
    const user = await this.usersRepository.findUserById(userId);
    return this.userMapper.toUserDto(user);
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
  ): Promise<GetUserDto> {
    // Hasher le MP si mise à jour avant de sauvegarder en DB
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }
    const updatedUser = await this.usersRepository.updateUser(
      userId,
      updateData,
    );
    return this.userMapper.toUserDto(updatedUser);
  }

  async deleteUser(userId: string) {
    const userBlogs = await this.blogsService.findBlogsByUserId(userId);
    const blogIds = userBlogs.map((blog) => blog.id);

    //Si user a un ou plusieurs blogs -> cascade
    if (blogIds.length > 0) {
      await this.blogsService.removeBlogs(blogIds, userId);
    }
    return await this.usersRepository.deleteUser(userId);
  }
}
