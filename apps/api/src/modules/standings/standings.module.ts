// ============================================================
// Na Quadra — Standings Module (via ESPN)
// ============================================================
import { Module } from '@nestjs/common';
import { StandingsController } from './standings.controller';
import { StandingsService } from './standings.service';
import { EspnModule } from '../espn/espn.module';

@Module({
  imports: [EspnModule],
  controllers: [StandingsController],
  providers: [StandingsService],
})
export class StandingsModule {}
