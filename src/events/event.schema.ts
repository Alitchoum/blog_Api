import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentPost } from './comment-post.schema';
import { LikePost } from './like-post.schema';

@Schema({ discriminatorKey: 'kind' })
export class Event {
  @Prop({
    type: String,
    required: true,
    enum: [CommentPost.name, LikePost.name],
  })
  kind: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;
}
export const EventSchema = SchemaFactory.createForClass(Event);
