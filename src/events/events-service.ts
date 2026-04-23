import { EventsRepository } from './events.repository';
import { EventsMapper } from './events-mapper';
import { Injectable } from '@nestjs/common';
import { FilteredEventQueryDto } from './_utils/dto/request/filtered-event-query.dto';
import { GetIncidentPaginatedDto } from './_utils/dto/get-events-paginated.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly eventMapper: EventsMapper,
  ) {}

  async getEvents(
    query: FilteredEventQueryDto,
  ): Promise<GetIncidentPaginatedDto> {
    const queryFilters = query.ToFiltersQuery;
    const total = await this.eventsRepository.countEvents(queryFilters);
    const events = await this.eventsRepository.getEvents(query);
    const eventsDtos = events.map((event) =>
      this.eventMapper.toEventDto(event),
    );
    return new GetIncidentPaginatedDto(query, total, eventsDtos);
  }
}
