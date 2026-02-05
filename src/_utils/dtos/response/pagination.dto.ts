import { ApiProperty } from '@nestjs/swagger';
import { PaginatedQueryDto } from '../request/paginated-query.dtos';

export class PaginationMetaDto {
  @ApiProperty({ type: 'number' })
  currentPage: number;

  @ApiProperty({ type: 'number' })
  totalItemsCount: number;

  @ApiProperty({ type: 'number' })
  totalPagesCount: number;

  @ApiProperty({ type: 'number' })
  itemsPerPage: number;
}

export class PaginationDto {
  meta: PaginationMetaDto;

  constructor(paginatedQuery: PaginatedQueryDto, totalItemsCount: number) {
    this.meta = {
      currentPage: paginatedQuery.currentPage,
      totalItemsCount,
      totalPagesCount: Math.ceil(totalItemsCount / paginatedQuery.limit),
      itemsPerPage: paginatedQuery.limit,
    };
  }
}
