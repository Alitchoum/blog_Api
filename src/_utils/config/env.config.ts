import { exit } from 'process';
import { IsBoolean, IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Logger } from '@nestjs/common';

export class EnvironmentVariables {
  @IsNumber()
  PORT: number = 3000;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string = '7d';

  @IsString()
  MONGODB_URL: string;

  @IsNumber()
  UPLOAD_MAX_FILES: number = 1;

  @IsNumber()
  UPLOAD_MAX_FILES_SIZE_MB: number = 5;

  // MinIO
  @IsString()
  MINIO_ENDPOINT: string;

  @IsNumber()
  MINIO_PORT: number;

  @IsString()
  MINIO_USER: string;

  @IsString()
  MINIO_PASSWORD: string;

  @IsString()
  MINIO_BUCKET: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }
  return validatedConfig;
}
