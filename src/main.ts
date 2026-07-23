import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './_utils/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.register(multipart);
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  app.setGlobalPrefix('api');
  return app.listen(configService.get('PORT'));
}
void bootstrap();
