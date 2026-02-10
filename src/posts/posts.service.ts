import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { GetPostDto } from './dto/response/get-post.dto';
import { BlogsService } from '../blogs/blogs.service';
import { PostMapper } from './post.mapper';
import { PostsRepository } from './posts.repository';
import { CommentsService } from '../comments/comments.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { TranslatedPostDto } from './dto/response/translated-post.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name); // gestion des erreurs

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly postsRepository: PostsRepository,
    @Inject(forwardRef(() => BlogsService))
    private readonly blogsService: BlogsService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    private readonly postMapper: PostMapper,
    private readonly httpService: HttpService,
  ) {}

  //CREATE POST
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<GetPostDto> {
    const blogs = await this.blogsService.findBlogsByIds([
      createPostDto.blogId,
    ]);
    const blog = blogs[0];

    if (blog.user.id !== userId) {
      throw new ForbiddenException('Blog not found');
    }
    const post = await this.postsRepository.createPost(createPostDto, userId);
    return this.postMapper.toPostDto(post);
  }

  //FIND ALL
  async findAllPosts(): Promise<GetPostDto[]> {
    const posts = await this.postsRepository.findAllPosts();
    return posts.map((post) => this.postMapper.toPostDto(post));
  }

  // FIND POST BY ID
  async findByPostId(postId: string, lang?: string): Promise<GetPostDto> {
    const post = await this.postsRepository.findByPostId(postId);
    let postDto = await this.postMapper.toPostDto(post);

    //Recupere le version traduite
    if (lang) {
      const translatedText = await this.translatePost(
        post.title,
        post.content,
        post.tags || [],
        lang,
      );

      //Applique la trad au dto
      postDto = {
        ...postDto,
        title: translatedText.title,
        content: translatedText.content,
        tags: translatedText.tags,
      };
    }

    console.log(postDto);
    return postDto;
  }

  //UPDATE
  async updatePost(
    postId: string,
    userId: string,
    updateData: UpdatePostDto,
  ): Promise<GetPostDto> {
    const updatedPost = await this.postsRepository.updatePost(
      postId,
      userId,
      updateData,
    );
    return this.postMapper.toPostDto(updatedPost);
  }

  //DELETE USER POST(S)
  async removePosts(postIds: string[], userId: string) {
    await this.commentsService.removeCommentsByPostIds(postIds);
    await this.postsRepository.removePosts(postIds, userId);
  }

  //DELETE CASCADE
  async removePostsByBlogId(blogIds: string[]) {
    const posts = await this.postsRepository.findPostsByBlogIds(blogIds);
    const postIds = posts.map((post) => post._id.toString());

    await this.commentsService.removeCommentsByPostIds(postIds);
    await this.postsRepository.deletePostsByIds(postIds);
  }

  //TRANSLATE
  async translatePost(
    title: string,
    content: string,
    tags: string[],
    lang: string,
  ): Promise<TranslatedPostDto> {
    const apiUrl = 'https://api-free.deepl.com/v2/translate';
    const apiKey = 'bfd7b804-95a8-403d-84ed-abfa843f7e1d:fx'; //API keydeepl

    const body = {
      text: [title, content, ...tags],
      target_lang: lang,
    };

    {
      const header = {
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
      };

      const { data } = await firstValueFrom(
        this.httpService.post<any>(apiUrl, body, header).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw 'the translation failed';
          }),
        ),
      );
      console.log(data);

      const translations = data.translations.map((t) => t.text); //

      console.log(translations);

      return {
        title: translations[0],
        content: translations[1],
        tags: translations.slice(2),
      };
    }
  }
}
