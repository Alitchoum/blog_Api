import { PaginationDto } from '../../../_utils/dtos/response/pagination.dto';
import { PaginatedQueryDto } from '../../../_utils/dtos/request/paginated-query.dtos';
import { GetEventUserCommentDto } from './response/get-event-user-comment.dto';
import { GetEventUserLikeDto } from './response/get-event-user-like.dto';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export type GetEventUnionDto = GetEventUserCommentDto | GetEventUserLikeDto;

export class GetEventsPaginatedDto extends PaginationDto {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(GetEventUserLikeDto) },
        { $ref: getSchemaPath(GetEventUserCommentDto) },
      ],
    },
  })
  items: GetEventUnionDto[];

  constructor(
    paginatedQuery: PaginatedQueryDto,
    totalItemsCount: number,
    items: GetEventUnionDto[],
  ) {
    super(paginatedQuery, totalItemsCount);
    this.items = items;
  }
}
