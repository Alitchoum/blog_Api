import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';
import { BlogDocument } from '../blog.schema';
import { SafePopulated } from '../../_utils/is-populated.function';

export class BlogDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  image?: string;
  @ApiProperty()
  user: UserDto;

  static toBlogDto(blog: BlogDocument): BlogDto {
    return {
      id: blog.id,
      title: blog.title,
      description: blog.description,
      image: blog.image,
      user: UserDto.toUserDto(SafePopulated(blog.user)),
    };
  }
}
