import { EventsRepository } from './events.repository';
import { GetEventDto } from './_utils/dto/response/get-event.dto';
import { EventsMapper } from './events-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly eventMapper: EventsMapper,
  ) {}

  async getEvents(): Promise<GetEventDto[]> {
    const events = await this.eventsRepository.getEvents();
    return events.map((event) => this.eventMapper.toEventDto(event));
  }
}
