import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostDocument } from '../posts/post.schema';
import { Types } from 'mongoose';
import { Post } from '@nestjs/common';
import { User, UserDocument } from '../users/user.schema';

@Schema()
export class LikePost {
  kind: string;
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId | PostDocument;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userLike: Types.ObjectId | UserDocument;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);
