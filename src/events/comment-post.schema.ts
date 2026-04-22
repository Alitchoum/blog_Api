import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts/post.schema';
import { Types } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';

@Schema()
export class CommentPost {
  kind: string;
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: Post.name })
  post: Types.ObjectId | PostDocument;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userComment: Types.ObjectId | UserDocument;
}

export const CommentPostSchema = SchemaFactory.createForClass(CommentPost);
