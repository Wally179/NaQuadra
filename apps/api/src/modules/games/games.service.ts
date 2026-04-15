// ============================================================
// Na Quadra — Games Service
// ============================================================
import { Injectable } from '@nestjs/common';
import { EspnService } from '../espn/espn.service';

@Injectable()
export class GamesService {
  constructor(private readonly espnService: EspnService) {}

  async getScoreboard(date?: string) {
    return this.espnService.getScoreboard(date);
  }
}
