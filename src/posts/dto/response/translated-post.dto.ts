import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TranslatedPostDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[] | null;
}
