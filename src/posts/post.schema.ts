import mongoose, { HydratedDocument } from 'mongoose';
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
  @Prop()
  images?: string[];
  @Prop()
  tags?: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Blog.name })
  blog: mongoose.Types.ObjectId | BlogDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId | UserDocument;
}

export const PostSchema = SchemaFactory.createForClass(Post);
