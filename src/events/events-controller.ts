import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events-service';
import { FilteredEventQueryDto } from './_utils/dto/request/filtered-event-query.dto';
import { GetIncidentPaginatedDto } from './_utils/dto/get-events-paginated.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get filtered events' })
  getEvents(
    @Query() query: FilteredEventQueryDto,
  ): Promise<GetIncidentPaginatedDto> {
    return this.eventsService.getEvents(query);
  }
}
