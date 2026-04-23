import { PaginationDto } from '../../../_utils/dtos/response/pagination.dto';
import { GetEventDto } from './response/get-event.dto';
import { PaginatedQueryDto } from '../../../_utils/dtos/request/paginated-query.dtos';

export class GetIncidentPaginatedDto extends PaginationDto {
  items: GetEventDto[];

  constructor(
    paginatedQuery: PaginatedQueryDto,
    totalItemsCount: number,
    items: GetEventDto[],
  ) {
    super(paginatedQuery, totalItemsCount);
    this.items = items;
  }
}
