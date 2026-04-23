import process from 'node:process';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[bootstrap] Node version:', process.version);
  console.log('[bootstrap] Creating Nest application...');

  const app = await NestFactory.create(AppModule, { cors: false });
  const config = app.get(ConfigService);

  const port = Number(config.get<string>('PORT')) || 3000;
  const corsOrigin = config.get<string>('CORS_ORIGIN', '*');

  console.log(`[bootstrap] PORT=${port}, NODE_ENV=${config.get('NODE_ENV')}`);

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

  const swaggerBuilder = new DocumentBuilder()
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
    .setLicense('MIT', 'https://opensource.org/licenses/MIT');

  const railwayDomain = config.get<string>('RAILWAY_PUBLIC_DOMAIN');
  const publicApiUrl = config.get<string>('PUBLIC_API_URL');

  if (publicApiUrl) {
    swaggerBuilder.addServer(publicApiUrl, 'Production');
  } else if (railwayDomain) {
    swaggerBuilder.addServer(`https://${railwayDomain}`, 'Production (Railway)');
  }
  swaggerBuilder.addServer(`http://localhost:${port}`, 'Local Development');

  swaggerBuilder
    .addTag('Health', 'API status and metadata')
    .addTag('Tasks', 'Create, read, update and delete tasks');

  const swaggerConfig = swaggerBuilder.build();

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

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 API ready on 0.0.0.0:${port} — /api`);
  console.log(`📘 Swagger docs — /api/docs`);
}

bootstrap().catch((err) => {
  console.error('[bootstrap] Fatal error:', err);
  process.exit(1);
});
