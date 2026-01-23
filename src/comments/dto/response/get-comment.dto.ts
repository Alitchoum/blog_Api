import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PostLightDto } from '../../../posts/dto/response/get-post-light.dto';
import { GetUserLightDto } from '../../../users/dto/response/get-user-light.dto';

export class GetCommentDto {
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

  @ApiProperty({ type: PostLightDto })
  @IsNotEmpty()
  @IsString()
  post: PostLightDto;

  @ApiProperty({ type: GetUserLightDto })
  @IsNotEmpty()
  @IsString()
  user: GetUserLightDto;
}
