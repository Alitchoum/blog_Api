import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventType = 'COMMENT_POST' | 'LIKE_POST';

@Schema({ discriminatorKey: 'kind', timestamps: true })
export class Event {
  kind: EventType;

  createdAt: Date;
  updatedAt: Date;
}
export const EventSchema = SchemaFactory.createForClass(Event);
