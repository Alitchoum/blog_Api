import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdateCommentDto {
  @ApiPropertyOptional({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content?: string;
}
