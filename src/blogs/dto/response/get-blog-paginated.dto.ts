import { PaginationDto } from '../../../_utils/dtos/response/pagination.dto';
import { GetBlogDto } from './get-blog.dto';
import { PaginatedQueryDto } from '../../../_utils/dtos/request/paginated-query.dtos';

export class GetBlogPaginatedDto extends PaginationDto {
  items: GetBlogDto[];

  constructor(
    paginatedQuery: PaginatedQueryDto,
    totalItemsCount: number,
    items: GetBlogDto[],
  ) {
    super(paginatedQuery, totalItemsCount);
    this.items = items;
  }
}
