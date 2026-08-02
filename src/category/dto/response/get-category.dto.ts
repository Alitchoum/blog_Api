import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryDto {
  @ApiProperty({ type: String, description: 'Category Id' })
  id: string;

  @ApiProperty({ type: String, description: 'Category Name' })
  name: string;
}
