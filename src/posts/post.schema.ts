import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs/blog.schema';
import { User, UserDocument } from '../users/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: null })
  images: string[] | null;

  @Prop({ type: [String], default: null })
  tags: string[] | null;

  @Prop({ type: Types.ObjectId, ref: Blog.name })
  blog: Types.ObjectId | BlogDocument;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId | UserDocument;
}

export const PostSchema = SchemaFactory.createForClass(Post);
