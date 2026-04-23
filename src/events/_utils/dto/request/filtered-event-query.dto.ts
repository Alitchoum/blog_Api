import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Optional } from 'class-validator-extended';
import { IsString } from 'class-validator';
import { QueryFilter } from 'mongoose';
import { PaginatedQueryDto } from '../../../../_utils/dtos/request/paginated-query.dtos';

export class FilteredEventQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Filter by Type : "CommentPost" or "LikePost"',
  })
  @Optional()
  @IsString()
  kind?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by post ID',
  })
  @Optional()
  @IsString()
  postId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Filter by user ID',
  })
  @Optional()
  @IsString()
  userId?: string;

  get ToFiltersQuery(): QueryFilter<Event> {
    const filters: QueryFilter<Event> = {};

    if (this.kind) {
      filters.kind = this.kind;
    }

    if (this.postId) {
      filters.post = this.postId;
    }

    if (this.userId) {
      filters.$or = [{ userLike: this.userId }, { userComment: this.userId }];
    }
    return filters;
  }
}
