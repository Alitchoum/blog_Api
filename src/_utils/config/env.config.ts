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
  JWT_EXPIRATION: string;

  @IsString()
  MONGODB_URL: string;

  @IsBoolean()
  SMTP_PREVIEW: boolean = false;

  @IsNumber()
  UPLOAD_MAX_FILES: number;

  @IsNumber()
  UPLOAD_MAX_FILES_SIZE_MB: number;
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
