import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.schema';
import { GetUserDto } from './dto/response/get-user.dto';
import { GetUserLightDto } from './dto/response/get-user-light.dto';

@Injectable()
export class UserMapper {
  toUserDto(user: UserDocument): GetUserDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  toUserLightDto(user: UserDocument): GetUserLightDto {
    return {
      id: user._id.toString(),
      name: user.name,
    };
  }
}
