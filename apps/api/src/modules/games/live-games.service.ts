// ============================================================
// Na Quadra — Live Games Service
// Handles play-by-play data from ESPN for live/final games.
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { EspnService } from '../espn/espn.service';
import { espnIdToSlug } from '../espn/team-mapping';
import type { GamePlayByPlayEvent, PlayEventType } from '@naquadra/types';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class LiveGamesService {
  private readonly logger = new Logger(LiveGamesService.name);
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly espnService: EspnService) {}

  // ── Play-by-play feed ──
  async getPlayByPlay(eventId: string, isLive: boolean): Promise<GamePlayByPlayEvent[]> {
    const cacheKey = `game:${eventId}:plays`;
    const ttl = isLive ? 15_000 : 7 * 24 * 60 * 60 * 1000; // 15s live, 7d final
    const cached = this.getFromCache<GamePlayByPlayEvent[]>(cacheKey);
    if (cached) return cached;

    const summary = await this.espnService.getEventSummary(eventId);
    if (!summary) return [];

    try {
      const plays = summary.plays as any[] || [];

      const events: GamePlayByPlayEvent[] = plays
        .filter((play: any) => play.text) // filter out empty plays
        .map((play: any) => {
          const type = this.categorizePlay(play);
          const teamRef = play.team as { id?: string } | undefined;

          return {
            id: String(play.id || Math.random()),
            clock: play.clock?.displayValue || play.displayClock || '',
            period: play.period?.number || play.period || 0,
            description: play.text || '',
            teamId: teamRef?.id ? espnIdToSlug(String(teamRef.id)) : null,
            type,
            scoreValue: play.scoringPlay ? (play.scoreValue || null) : null,
            homeScore: play.homeScore || 0,
            awayScore: play.awayScore || 0,
            isScoring: play.scoringPlay || false,
          } as GamePlayByPlayEvent;
        })
        .reverse(); // Most recent first

      this.setCache(cacheKey, events, ttl);
      return events;
    } catch (error) {
      this.logger.error(`Failed to parse plays for ${eventId}`, (error as Error).message);
      return [];
    }
  }

  // ── Categorize a play into our PlayEventType ──
  private categorizePlay(play: any): PlayEventType {
    const type = (play.type?.text || play.type?.description || '').toLowerCase();
    const text = (play.text || '').toLowerCase();

    if (type.includes('three point') || text.includes('three point') || text.includes('3pt')) return 'three-pointer';
    if (type.includes('free throw') || text.includes('free throw')) return 'free-throw';
    if (type.includes('field goal') || text.includes('makes') || text.includes('layup') || text.includes('dunk') || text.includes('shot')) return 'field-goal';
    if (type.includes('rebound') || text.includes('rebound')) return 'rebound';
    if (type.includes('assist') || text.includes('assist')) return 'assist';
    if (type.includes('steal') || text.includes('steal')) return 'steal';
    if (type.includes('block') || text.includes('block')) return 'block';
    if (type.includes('turnover') || text.includes('turnover')) return 'turnover';
    if (type.includes('foul') || text.includes('foul')) return 'foul';
    if (type.includes('timeout') || text.includes('timeout')) return 'timeout';
    if (type.includes('substitution') || text.includes('enters')) return 'substitution';
    if (type.includes('jump ball') || text.includes('jump ball')) return 'jump-ball';
    if (type.includes('violation') || text.includes('violation')) return 'violation';
    return 'other';
  }

  // ── Cache helpers ──
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }
}
