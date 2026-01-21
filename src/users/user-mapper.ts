import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserMapper {
  toUserDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
