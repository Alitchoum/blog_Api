import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioClientMapper } from './minio-client.mapper';

@Module({
  providers: [MinioClientService, MinioClientMapper],
  exports: [MinioClientService, MinioClientMapper],
})
export class MinioClientModule {}
