import { PaginationDto } from '../../../_utils/dtos/response/pagination.dto';
import { PaginatedQueryDto } from '../../../_utils/dtos/request/paginated-query.dtos';
import { GetPostDto } from './get-post.dto';

export class GetBlogPaginatedDto extends PaginationDto {
  items: GetPostDto[];

  constructor(
    paginatedQuery: PaginatedQueryDto,
    totalItemsCount: number,
    items: GetPostDto[],
  ) {
    super(paginatedQuery, totalItemsCount);
    this.items = items;
  }
}
