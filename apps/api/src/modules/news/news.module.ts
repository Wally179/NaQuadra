// ============================================================
// Na Quadra — News Module (ESPN Integration)
// ============================================================
import { Module } from '@nestjs/common';
import { EspnModule } from '../espn/espn.module';
import { NewsController } from './news.controller';
import { AggregatedNewsService } from './aggregated-news.service';

@Module({
  imports: [EspnModule],
  controllers: [NewsController],
  providers: [AggregatedNewsService],
  exports: [AggregatedNewsService],
})
export class NewsModule {}
