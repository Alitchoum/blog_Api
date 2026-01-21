import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';
import { GetPostDto } from '../../posts/dto/response/get-post.dto';

export class CommentDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: GetPostDto })
  @IsNotEmpty()
  @IsString()
  post: GetPostDto;

  @ApiProperty({ type: UserDto })
  @IsNotEmpty()
  @IsString()
  user: UserDto;
}
