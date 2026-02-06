export class MinioClientMapper {
  static getBlogImageKey(blogId: string): string {
    return `public/blog/${blogId}/${Date.now()}`;
  }

  // static getPostImageKey(PostId: string): string {
  //   return `public/post/${PostId}/${Date.now()}`;
  // }
}
