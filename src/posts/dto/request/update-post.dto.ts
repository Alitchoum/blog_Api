import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdatePostDto {
  @ApiPropertyOptional({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @Optional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @ApiPropertyOptional({ type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[] | null;

  @ApiPropertyOptional({ type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] | null;
}
