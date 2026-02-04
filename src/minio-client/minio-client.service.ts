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
    this.setBucketPolicy();
  }

  //Rendre public toutes les images de l'API
  private async setBucketPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicAccess',
          Effect: 'Allow', // On autorise
          Principal: { AWS: ['*'] }, // Tout le monde (anonyme inclus)
          Action: ['s3:GetObject'], // Droit de lecture seule
          Resource: [
            `arn:aws:s3:::${this.bucketName}/public/*`, // CIBLE: Uniquement le dossier public
          ],
        },
      ],
    };

    await this.minioClient.setBucketPolicy(
      this.bucketName,
      JSON.stringify(policy),
    );
  }

  // Sauvegarder image
  async uploadFile(image: MemoryStoredFile, key: string): Promise<void> {
    await this.minioClient.putObject(
      this.bucketName,
      key,
      image.buffer,
      image.size,
      {
        'Content-Type': image || 'application/octet-stream',
      },
    );
  }

  //Rendre public avec expiration
  async getPresignedUrl(key: string): Promise<string> {
    return await this.minioClient.presignedGetObject(
      this.bucketName,
      key,
      3600,
    );
  }

  // Supprimer image
  async deleteImage(key: string) {
    await this.minioClient.removeObject(this.bucketName, key);
  }
}
