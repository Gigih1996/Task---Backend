import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);

  const port = config.get<number>('PORT', 3000);
  const corsOrigin = config.get<string>('CORS_ORIGIN', '*');

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((s) => s.trim()),
    credentials: true
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription(
      'Professional Task Management REST API built with NestJS, Prisma and MySQL.'
    )
    .setVersion('1.0.0')
    .setContact(
      'Task Management Team',
      'https://github.com',
      'support@taskflow.dev'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${port}`, 'Local')
    .addTag('Health', 'API status and metadata')
    .addTag('Tasks', 'Create, read, update and delete tasks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Task Management API — Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'list',
      tryItOutEnabled: true
    }
  });

  await app.listen(port);
  console.log(`🚀 API ready on http://localhost:${port}/api`);
  console.log(`📘 Swagger docs on http://localhost:${port}/api/docs`);
}

bootstrap();
