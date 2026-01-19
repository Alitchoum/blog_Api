import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserDocument } from '../user.schema';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  //FUNCTION TO OBJECT USER -> DTO
  static toUserDto(user: UserDocument): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
