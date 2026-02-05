import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { CommentsService } from '../comments/comments.service';

export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly commentsService: CommentsService,

    // @Inject(forwardRef(() => CommentsService)) // Pour casser la boucle
    // private readonly commentsService: CommentsService,
  ) {}

  async findAllPosts(): Promise<PostDocument[]> {
    return await this.postModel
      .find()
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('No found posts'))
      .exec();
  }

  async findByPostId(postId: string) {
    return await this.postModel
      .findById(postId)
      .populate(['user', 'blog'])
      .orFail(new NotFoundException('Post not found'))
      .exec();
  }

  async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostDto,
  ): Promise<PostDocument> {
    return await this.postModel
      .findOneAndUpdate(
        { _id: postId, user: userId },
        { $set: updateData },
        {
          new: true,
        },
      )
      .orFail(new NotFoundException('Post not found'))
      .populate('user')
      .populate({ path: 'blog', populate: { path: 'user' } })
      .exec();
  }

  async removePosts(postIds: string[], userId: string) {
    await this.postModel
      .deleteMany({
        _id: { $in: postIds },
        user: userId,
      })
      .exec();
  }

  async removePostsByBlogId(blogIds: string[]) {
    const posts = await this.postModel
      .find({
        blog: { $in: blogIds },
      })
      .orFail(new NotFoundException('Post(s) not found'))
      .exec();

    const postIds = posts.map((post) => post._id.toString()); //recup IDS post

    await this.commentsService.removeCommentsByPostIds(postIds); //supprime tous les commentaires associés au post (incluant les autres users)
    await this.postModel.deleteMany({ _id: { $in: postIds } }); //supprime les posts
  }
}
