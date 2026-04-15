// ============================================================
// Na Quadra — News Module (ESPN Integration)
// ============================================================
import { Module } from '@nestjs/common';
import { EspnModule } from '../espn/espn.module';
import { NewsController } from './news.controller';

@Module({
  imports: [EspnModule],
  controllers: [NewsController],
})
export class NewsModule {}
