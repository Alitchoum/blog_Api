import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import UploadController from './upload.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NestjsFormDataModule, AuthModule, UsersModule],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
