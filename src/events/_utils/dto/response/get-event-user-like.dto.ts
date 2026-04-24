import { ApiProperty } from '@nestjs/swagger';
import { GetUserLightDto } from '../../../../users/dto/response/get-user-light.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { PostLightDto } from '../../../../posts/dto/response/get-post-light.dto';

export class GetEventUserLikeDto {
  @ApiProperty({ type: String, description: 'Event ID' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  kind: string;

  @ApiProperty({ type: Date, description: 'Event date' })
  createdAt: Date;

  @ApiProperty({ type: PostLightDto })
  @IsNotEmpty()
  post: PostLightDto;

  @ApiProperty({ type: GetUserLightDto })
  @IsNotEmpty()
  userLike: GetUserLightDto;
}
