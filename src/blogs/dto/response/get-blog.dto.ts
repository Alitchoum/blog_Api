import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Nullable, Optional } from 'class-validator-extended';
import { GetUserLightDto } from '../../../users/dto/response/get-user-light.dto';

export class GetBlogDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: String, nullable: true })
  @Optional()
  @Nullable()
  @IsString()
  image?: string | null;

  @ApiProperty({ type: GetUserLightDto })
  @IsNotEmpty()
  user: GetUserLightDto;
}
