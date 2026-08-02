import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryFilter } from 'mongoose';
import { BlogDocument } from '../../blog.schema';
import { PaginatedQueryDto } from '../../../_utils/dtos/request/paginated-query.dtos';

export class searchQueryBlogDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ type: String, description: 'search query' })
  @IsOptional()
  @IsString()
  search?: string;

  get toFilteredBlog(): QueryFilter<BlogDocument> {
    const filter: QueryFilter<BlogDocument> = {};
    if (this.search) {
      filter.title = { $regex: this.search, $options: 'i' };
    }
    return filter;
  }
}
