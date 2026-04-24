import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events-service';
import { FilteredEventQueryDto } from './_utils/dto/request/filtered-event-query.dto';
import { GetEventsPaginatedDto } from './_utils/dto/get-events-paginated.dto';
import { GetEventUserLikeDto } from './_utils/dto/response/get-event-user-like.dto';
import { GetEventUserCommentDto } from './_utils/dto/response/get-event-user-comment.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiExtraModels(GetEventUserCommentDto, GetEventUserLikeDto)
  @Get()
  @ApiOperation({ summary: 'Get filtered events' })
  @ApiResponse({ status: 200, type: GetEventsPaginatedDto })
  getEvents(
    @Query() query: FilteredEventQueryDto,
  ): Promise<GetEventsPaginatedDto> {
    return this.eventsService.getEvents(query);
  }
}
