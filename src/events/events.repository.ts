import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';
import { Injectable } from '@nestjs/common';

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

  async getEvents(): Promise<Event[]> {
    return await this.eventModel
      .find()
      .populate('post')
      .populate('userLike')
      .populate('userComment')
      .exec();
  }
}
