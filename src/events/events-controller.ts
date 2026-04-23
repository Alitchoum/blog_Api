import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events-service';
import { GetEventDto } from './_utils/dto/response/get-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get events' })
  getEvents(): Promise<GetEventDto[]> {
    return this.eventsService.getEvents();
  }
}
