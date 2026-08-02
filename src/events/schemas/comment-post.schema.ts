import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostDocument } from '../../posts/post.schema';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from '../../users/user.schema';
import { Event } from './event.schema';

export type CommentPostDocument = HydratedDocument<CommentPost>;
@Schema()
export class CommentPost extends Event {
  declare kind: 'COMMENT_POST';
  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId | PostDocument;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userComment: Types.ObjectId | UserDocument;

  @Prop({ type: String })
  content: string;
}

export const CommentPostSchema = SchemaFactory.createForClass(CommentPost);
