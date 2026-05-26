// ============================================================
// Na Quadra API — Root Module
// ============================================================
// When SKIP_DB=true, only ESPN-based endpoints are active.
// When databases are available, the full module tree loads.
// ============================================================
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Feature modules (ESPN-only — no database required)
import { PlayersModule } from './modules/players/players.module';
import { GamesModule } from './modules/games/games.module';
import { StandingsModule } from './modules/standings/standings.module';
import { HealthModule } from './modules/health/health.module';
import { NewsModule } from './modules/news/news.module';

// Feature modules (require databases)
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { GlossaryModule } from './modules/glossary/glossary.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

// Config
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import espnConfig from './config/espn.config';
import balldontlieConfig from './config/balldontlie.config';

const logger = new Logger('AppModule');
const SKIP_DB = process.env.SKIP_DB === 'true';

// ── Database imports (only when SKIP_DB is not true) ──
const databaseImports = SKIP_DB
  ? (() => {
      logger.warn('⚠️  SKIP_DB=true — Running in ESPN-only mode (no PostgreSQL/MongoDB)');
      return [];
    })()
  : [
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          type: 'postgres' as const,
          url: config.get<string>('database.postgres.url'),
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV === 'development', // Useful for Neon dev branches
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
          logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
          retryAttempts: 3,
          retryDelay: 3000,
        }),
      }),
      MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          uri: config.get<string>('database.mongodb.uri'),
          serverSelectionTimeoutMS: 5000,
        }),
      }),
      AuthModule,
      TeamsModule,
      ArticlesModule,
      GlossaryModule,
      FavoritesModule,
    ];

@Module({
  imports: [
    // ── Always loaded ──
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, espnConfig, balldontlieConfig],
      envFilePath: ['.env.local', '.env', '../../.env.local', '../../.env', '.env.example'],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([{
        ttl: config.get<number>('app.throttleTtl', 60000),
        limit: config.get<number>('app.throttleLimit', 100),
      }]),
    }),

    // ESPN-only modules (always available)
    PlayersModule,
    GamesModule,
    StandingsModule,
    HealthModule,
    NewsModule,

    // Database-dependent modules (conditional)
    ...databaseImports,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
