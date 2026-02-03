export class MinioClientMapper {
  static getBlogImageKey(blogId: string): string {
    return `public/blog/${blogId}/${Date.now()}`;
  }

  static CreateImageUrl(key: string) {
    const endPoint = process.env.MINIO_ENDPOINT;
    const port = process.env.MINIO_PORT;
    const bucket = process.env.MINIO_BUCKET;

    return `http://${endPoint}:${port}/${bucket}/${key}`;
  }
}
