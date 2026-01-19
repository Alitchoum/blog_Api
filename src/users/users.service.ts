import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAllUser(): Promise<UserDto[]> {
    const users = await this.usersRepository.findAllUsers();
    return users.map((user) => this.toUserDto(user));
  }

  async findUserById(userId: string): Promise<UserDto> {
    const user = await this.usersRepository.findUserById(userId);
    return this.toUserDto(user);
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
  ): Promise<UserDto> {
    // Hasher le MP si mise à jour avant de sauvegarder en DB
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 8);
    }
    const updatedUser = await this.usersRepository.updateUser(
      userId,
      updateData,
    );
    return this.toUserDto(updatedUser);
  }

  async deleteUser(userId: string) {
    return await this.usersRepository.deleteUser(userId);
  }

  //FUNCTION TO OBJECT USER -> DTO
  toUserDto(user: UserDocument): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
