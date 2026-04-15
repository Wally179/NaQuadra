// ============================================================
// Na Quadra — Standings Service
// ============================================================
import { Injectable } from '@nestjs/common';
import { EspnService, NormalizedStandingsEntry } from '../espn/espn.service';

@Injectable()
export class StandingsService {
  constructor(private readonly espnService: EspnService) {}

  async getStandings(conference?: string): Promise<NormalizedStandingsEntry[]> {
    const all = await this.espnService.getStandings();
    if (conference) {
      return all.filter((e) => e.conference === conference);
    }
    return all;
  }
}
