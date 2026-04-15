// ============================================================
// Na Quadra — Games Module (Scoreboard via ESPN)
// ============================================================
import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { EspnModule } from '../espn/espn.module';

@Module({
  imports: [EspnModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
