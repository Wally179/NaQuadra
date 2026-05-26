// ============================================================
// Na Quadra — BallDontLie Service
// Integration with BallDontLie v1 API for historical data,
// season averages, and head-to-head records.
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  RecentGameResult,
  HeadToHeadGame,
  PlayerSeasonPreview,
} from '@naquadra/types';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class BallDontLieService {
  private readonly logger = new Logger(BallDontLieService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get<string>('balldontlie.baseUrl')!;
    this.apiKey = config.get<string>('balldontlie.apiKey')!;
  }

  // ── Recent games for a team (last 5) ──
  async getRecentGames(bdlTeamId: number): Promise<RecentGameResult[]> {
    const cacheKey = `bdl:recent:${bdlTeamId}`;
    const cached = this.getFromCache<RecentGameResult[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.apiFetch<{ data: any[] }>(
        `/games?team_ids[]=${bdlTeamId}&per_page=5&sort=date&sort_direction=desc`,
      );

      if (!data?.data) return [];

      const results: RecentGameResult[] = data.data.map((game: any) => {
        const isHome = game.home_team?.id === bdlTeamId;
        const ownScore = isHome ? game.home_team_score : game.visitor_team_score;
        const oppScore = isHome ? game.visitor_team_score : game.home_team_score;
        const opponent = isHome ? game.visitor_team : game.home_team;

        return {
          date: game.date,
          opponentId: String(opponent?.id || ''),
          opponentName: opponent?.full_name || 'Unknown',
          result: ownScore > oppScore ? 'W' : 'L',
          score: `${ownScore}-${oppScore}`,
          isHome,
        } as RecentGameResult;
      });

      this.setCache(cacheKey, results, 6 * 60 * 60 * 1000); // 6h TTL
      return results;
    } catch (error) {
      this.logger.error(`Failed to fetch recent games for BDL team ${bdlTeamId}`, (error as Error).message);
      return [];
    }
  }

  // ── Head-to-head between two teams ──
  async getHeadToHead(bdlTeamId1: number, bdlTeamId2: number): Promise<HeadToHeadGame[]> {
    const cacheKey = `bdl:h2h:${Math.min(bdlTeamId1, bdlTeamId2)}:${Math.max(bdlTeamId1, bdlTeamId2)}`;
    const cached = this.getFromCache<HeadToHeadGame[]>(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.apiFetch<{ data: any[] }>(
        `/games?team_ids[]=${bdlTeamId1}&team_ids[]=${bdlTeamId2}&per_page=5&sort=date&sort_direction=desc`,
      );

      if (!data?.data) return [];

      const results: HeadToHeadGame[] = data.data.map((game: any) => ({
        date: game.date,
        homeTeamId: String(game.home_team?.id || ''),
        awayTeamId: String(game.visitor_team?.id || ''),
        homeScore: game.home_team_score || 0,
        awayScore: game.visitor_team_score || 0,
        winnerId: String(
          game.home_team_score > game.visitor_team_score
            ? game.home_team?.id
            : game.visitor_team?.id,
        ),
      }));

      this.setCache(cacheKey, results, 24 * 60 * 60 * 1000); // 24h TTL
      return results;
    } catch (error) {
      this.logger.error(`Failed to fetch H2H for ${bdlTeamId1} vs ${bdlTeamId2}`, (error as Error).message);
      return [];
    }
  }

  // ── Season averages for players ──
  async getSeasonAverages(
    playerIds: number[],
    season?: number,
  ): Promise<PlayerSeasonPreview[]> {
    if (playerIds.length === 0) return [];

    const currentSeason = season || new Date().getFullYear();
    const idsStr = playerIds.join(',');
    const cacheKey = `bdl:seasonAvg:${currentSeason}:${idsStr}`;
    const cached = this.getFromCache<PlayerSeasonPreview[]>(cacheKey);
    if (cached) return cached;

    try {
      const params = playerIds.map((id) => `player_ids[]=${id}`).join('&');
      const data = await this.apiFetch<{ data: any[] }>(
        `/season_averages?season=${currentSeason}&${params}`,
      );

      if (!data?.data) return [];

      const results: PlayerSeasonPreview[] = data.data.map((avg: any) => ({
        playerId: String(avg.player_id),
        playerName: '', // Will be enriched by caller
        headshot: null,
        position: '',
        gamesPlayed: avg.games_played || 0,
        ppg: avg.pts || 0,
        rpg: avg.reb || 0,
        apg: avg.ast || 0,
        fgPct: avg.fg_pct ? Math.round(avg.fg_pct * 1000) / 10 : 0,
        threePct: avg.fg3_pct ? Math.round(avg.fg3_pct * 1000) / 10 : 0,
      }));

      this.setCache(cacheKey, results, 6 * 60 * 60 * 1000); // 6h TTL
      return results;
    } catch (error) {
      this.logger.error(`Failed to fetch season averages`, (error as Error).message);
      return [];
    }
  }

  // ── Internal: API fetch with auth ──
  private async apiFetch<T>(path: string): Promise<T | null> {
    if (!this.apiKey) {
      this.logger.warn('BallDontLie API key not configured');
      return null;
    }

    const url = `${this.baseUrl}${path}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: this.apiKey,
        },
      });
      if (!res.ok) {
        this.logger.warn(`BallDontLie API responded ${res.status} for ${path}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (error) {
      this.logger.error(`BallDontLie API error: ${path}`, (error as Error).message);
      return null;
    }
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
