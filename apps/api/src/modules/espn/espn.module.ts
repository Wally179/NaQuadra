// ============================================================
// Na Quadra — ESPN Module (Real API Integration)
// ============================================================
import { Module } from '@nestjs/common';
import { EspnService } from './espn.service';

@Module({
  providers: [EspnService],
  exports: [EspnService],
})
export class EspnModule {}
