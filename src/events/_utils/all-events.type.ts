import { CommentPostDocument } from '../schemas/comment-post.schema';
import { LikePostDocument } from '../schemas/like-post.schema';

export type EventUnion = CommentPostDocument | LikePostDocument;
