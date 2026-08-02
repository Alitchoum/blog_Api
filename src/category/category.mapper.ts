import { CategoryDocument } from './category.schema';
import { GetCategoryDto } from './dto/response/get-category.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryMapper {
  toCategoryDto(category: CategoryDocument): GetCategoryDto {
    return {
      id: category.id.toString(),
      name: category.name,
    };
  }
}
