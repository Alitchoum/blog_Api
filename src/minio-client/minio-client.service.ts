import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class MinioClientService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string; // dossier contenant le images
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.bucketName = this.configService.get('MINIO_BUCKET');

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: this.configService.get('MINIO_PORT'),
      useSSL: false,
      accessKey: this.configService.get('MINIO_USER'),
      secretKey: this.configService.get('MINIO_PASSWORD'),
    });
  }

  // Sauvegarder image
  async uploadFile(image: MemoryStoredFile, key: string): Promise<void> {
    await this.minioClient.putObject(
      this.bucketName,
      key,
      image.buffer,
      image.size,
    );
  }

  //Rendre public avec une date expiration
  async getPresignedUrl(key: string): Promise<string> {
    return await this.minioClient.presignedGetObject(
      this.bucketName,
      key,
      3600,
    );
  }

  // Supprimer image
  async deleteFile(fileName: string) {
    const name = fileName.split('/').pop();
    if (name) {
      await this.minioClient.removeObject(this.bucketName, name);
    }
  }
}
