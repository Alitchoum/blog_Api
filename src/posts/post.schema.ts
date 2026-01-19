import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Blog } from '../blogs/blog.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  image?: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Blog.name })
  blogId: mongoose.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
