// ============================================================
// Na Quadra — Games Module
// Registers all game-related services: ESPN, BallDontLie,
// stats, live plays, and the orchestrating GamesService.
// ============================================================
import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameStatsService } from './game-stats.service';
import { LiveGamesService } from './live-games.service';
import { BallDontLieService } from './ball-dont-lie.service';
import { EspnModule } from '../espn/espn.module';

@Module({
  imports: [EspnModule],
  controllers: [GamesController],
  providers: [
    GamesService,
    GameStatsService,
    LiveGamesService,
    BallDontLieService,
  ],
  exports: [GamesService],
})
export class GamesModule {}
