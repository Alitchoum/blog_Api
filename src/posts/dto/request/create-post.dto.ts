import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class CreatePostDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({ type: [String] })
  @Optional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ type: [String] })
  @Optional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: true })
  @IsString()
  blogId: string;
}
