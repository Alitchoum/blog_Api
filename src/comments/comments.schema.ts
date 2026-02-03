import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post, PostDocument } from '../posts/post.schema';
import { User, UserDocument } from '../users/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true }) //ajout date auto
export class Comment {
  @Prop({ required: true, type: String })
  content: string;
  createdAt: Date;
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId | UserDocument;
  @Prop({ type: Types.ObjectId, ref: Post.name })
  post: Types.ObjectId | PostDocument;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
