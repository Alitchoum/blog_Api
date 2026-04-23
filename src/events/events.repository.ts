import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Event } from './event.schema';
import { Injectable } from '@nestjs/common';
import { FilteredEventQueryDto } from './_utils/dto/request/filtered-event-query.dto';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async createEventLikePost(postId: string, userId: string) {
    return await this.eventModel.create({
      kind: 'LikePost',
      createdAt: new Date(),
      post: postId,
      userLike: userId,
    } as any);
  }

  async createEventCommentPost(postId: string, userId: string) {
    return await this.eventModel.create({
      kind: 'CommentPost',
      createdAt: new Date(),
      post: postId,
      userComment: userId,
    } as any);
  }

  async getEvents(query: FilteredEventQueryDto): Promise<Event[]> {
    return await this.eventModel
      .find(query.ToFiltersQuery)
      .skip(query.skip)
      .limit(query.limit)
      .populate('post')
      .populate('userLike')
      .populate('userComment')
      .exec();
  }

  async countEvents(filter: QueryFilter<Event>): Promise<number> {
    return await this.eventModel.countDocuments(filter).exec();
  }
}
