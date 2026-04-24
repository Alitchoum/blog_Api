import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostDocument } from '../../posts/post.schema';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from '../../users/user.schema';
import { Event } from './event.schema';

export type LikePostDocument = HydratedDocument<LikePost>;

@Schema()
export class LikePost extends Event {
  declare kind: 'LIKE_POST';
  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId | PostDocument;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userLike: Types.ObjectId | UserDocument;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);
