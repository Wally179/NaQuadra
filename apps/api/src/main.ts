// ============================================================
// Na Quadra API — Bootstrap (main.ts)
// ============================================================
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // ── Security ──
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ── API Prefix + Versioning ──
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ── Validation ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Swagger / OpenAPI ──
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Na Quadra API')
      .setDescription(
        'REST API for Na Quadra NBA Platform.\n\n' +
          '**Auth**: JWT Bearer token in `Authorization` header.\n' +
          '**Rate Limit**: 100 req/min per IP.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & Authorization')
      .addTag('teams', 'NBA Teams')
      .addTag('players', 'NBA Players')
      .addTag('games', 'Game Scores & Schedules')
      .addTag('standings', 'Conference Standings')
      .addTag('articles', 'News & Analysis')
      .addTag('glossary', 'Basketball Glossary')
      .addTag('favorites', 'User Favorites')
      .addTag('health', 'Service Health')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Na Quadra API Docs',
      customCss: '.swagger-ui .topbar { background-color: #0A0A0C; }',
    });
    logger.log('📄 Swagger: http://localhost:' + (process.env.PORT || 4000) + '/api/docs');
  }

  // ── Start ──
  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🏀 Na Quadra API running on http://localhost:${port}`);
  logger.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
