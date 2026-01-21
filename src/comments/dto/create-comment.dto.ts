import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
