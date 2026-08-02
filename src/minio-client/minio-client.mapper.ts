export class MinioClientMapper {
  static getBlogImageKey(blogId: string): string {
    return `public/blog/${blogId}/${Date.now()}`;
  }

  static getPostImageKey(postId: string): string {
    return `public/post/${postId}/${Date.now()}`;
  }

  static extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts.slice(4).join('/');
  }
}
