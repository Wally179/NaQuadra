// ============================================================
// Na Quadra — Games Service
// Orchestrates game data from ESPN + BallDontLie into
// the GameSummary and GameDetail types.
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { EspnService, type NormalizedScore } from '../espn/espn.service';
import { GameStatsService } from './game-stats.service';
import { LiveGamesService } from './live-games.service';
import { BallDontLieService } from './ball-dont-lie.service';
import { espnIdToSlug } from '../espn/team-mapping';
import type {
  GameSummary,
  GameTeamInfo,
  GameDetail,
  GamePreview,
  GameStatus,
} from '@naquadra/types';

// BallDontLie team ID mapping (ESPN slug → BDL team ID)
const SLUG_TO_BDL: Record<string, number> = {
  atl: 1, bos: 2, bkn: 3, cha: 4, chi: 5, cle: 6, dal: 7, den: 8,
  det: 9, gsw: 10, hou: 11, ind: 12, lac: 13, lal: 14, mem: 15, mia: 16,
  mil: 17, min: 18, nop: 19, nyk: 20, okc: 21, orl: 22, phi: 23, phx: 24,
  por: 25, sac: 26, sas: 27, tor: 28, uta: 29, wsh: 30,
};

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(
    private readonly espnService: EspnService,
    private readonly gameStatsService: GameStatsService,
    private readonly liveGamesService: LiveGamesService,
    private readonly ballDontLieService: BallDontLieService,
  ) {}

  // ── Scoreboard (list of games) — new GameSummary format ──
  async getScoreboard(date?: string): Promise<GameSummary[]> {
    const cacheKey = `scoreboard:${date || 'today'}`;
    const cached = this.getFromCache<GameSummary[]>(cacheKey);
    if (cached) return cached;

    const scores = await this.espnService.getScoreboard(date);
    const summaries = scores.map((s) => this.scoreToSummary(s));

    // Adaptive TTL: shorter if any game is live
    const hasLive = summaries.some((s) => s.status === 'live');
    const ttl = hasLive ? 15_000 : 5 * 60 * 1000; // 15s live, 5min otherwise

    this.setCache(cacheKey, summaries, ttl);
    return summaries;
  }

  // ── Scoreboard legacy — flat NormalizedScore for homepage ScoreboardBar ──
  async getScoreboardLegacy(date?: string): Promise<NormalizedScore[]> {
    return this.espnService.getScoreboard(date);
  }

  // ── Single game detail ──
  async getGameDetail(eventId: string): Promise<GameDetail | null> {
    // Get base summary from scoreboard
    const scoreboard = await this.espnService.getScoreboard();
    let scoreItem = scoreboard.find((s) => s.externalId === eventId);

    // If not found in today's scoreboard (e.g. an old game or future game), fetch directly
    if (!scoreItem) {
      scoreItem = await this.espnService.getNormalizedEvent(eventId) || undefined;
    }

    if (!scoreItem) {
      this.logger.warn(`Game ${eventId} not found in scoreboard or summary`);
      return null;
    }

    const summary = this.scoreToSummary(scoreItem);
    const isLive = summary.status === 'live';
    const isFinal = summary.status === 'final';

    // Fetch enrichments in parallel
    const [teamStats, leaders, playerStats, periodScores, preview] = await Promise.all([
      (isLive || isFinal) ? this.gameStatsService.getTeamStats(eventId, isLive) : null,
      (isLive || isFinal) ? this.gameStatsService.getLeaders(eventId, isLive) : null,
      (isLive || isFinal) ? this.gameStatsService.getPlayerStats(eventId, isLive) : null,
      (isLive || isFinal) ? this.gameStatsService.getPeriodScores(eventId, isLive) : null,
      summary.status === 'scheduled' ? this.buildPreview(summary) : null,
    ]);

    if (periodScores) {
      summary.periodScores = periodScores;
    }

    return {
      summary,
      teamStats: teamStats ?? null,
      leaders: leaders ?? null,
      playerStats: playerStats ?? null,
      preview: preview ?? null,
    };
  }

  // ── Build pre-game preview ──
  private async buildPreview(summary: GameSummary): Promise<GamePreview | null> {
    const homeBdlId = SLUG_TO_BDL[summary.homeTeam.id];
    const awayBdlId = SLUG_TO_BDL[summary.awayTeam.id];

    if (!homeBdlId || !awayBdlId) return null;

    try {
      const [homeRecent, awayRecent, h2h] = await Promise.all([
        this.ballDontLieService.getRecentGames(homeBdlId),
        this.ballDontLieService.getRecentGames(awayBdlId),
        this.ballDontLieService.getHeadToHead(homeBdlId, awayBdlId),
      ]);

      return {
        homeRecentForm: homeRecent,
        awayRecentForm: awayRecent,
        headToHead: h2h,
        homeKeyPlayers: [], // Will be enriched in Phase 2
        awayKeyPlayers: [],
      };
    } catch (error) {
      this.logger.error(`Failed to build preview for game`, (error as Error).message);
      return null;
    }
  }

  // ── Convert NormalizedScore to GameSummary ──
  private scoreToSummary(score: NormalizedScore): GameSummary {
    const makeTeamInfo = (
      id: string, name: string, abbr: string, logo: string, record: string,
    ): GameTeamInfo => {
      // Try to get colors from ESPN data — use fallback neutral colors
      const teamColors = this.getTeamColors(id);
      return {
        id,
        name,
        abbreviation: abbr,
        logo,
        record,
        colors: teamColors,
      };
    };

    // Period scores are NOT fetched here for performance.
    // They are only fetched in getGameDetail() to avoid N API calls.

    return {
      id: score.externalId,
      date: score.date,
      startTime: score.startTime,
      status: score.status as GameStatus,
      homeTeam: makeTeamInfo(
        score.homeTeamId, score.homeTeamName, score.homeTeamAbbr,
        score.homeTeamLogo, score.homeRecord,
      ),
      awayTeam: makeTeamInfo(
        score.awayTeamId, score.awayTeamName, score.awayTeamAbbr,
        score.awayTeamLogo, score.awayRecord,
      ),
      homeScore: score.homeScore,
      awayScore: score.awayScore,
      period: score.quarter ? parseInt(score.quarter.replace('Q', ''), 10) || null : null,
      clock: score.clock,
      venue: score.venue,
      broadcast: score.broadcast,
      seriesInfo: score.seriesInfo,
      periodScores: null,
    };
  }

  // ── Team colors from static data ──
  private getTeamColors(slug: string): { primary: string; secondary: string } {
    const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
      atl: { primary: '#E03A3E', secondary: '#C1D32F' },
      bos: { primary: '#007A33', secondary: '#BA9653' },
      bkn: { primary: '#FFFFFF', secondary: '#777D84' },
      cha: { primary: '#1D1160', secondary: '#00788C' },
      chi: { primary: '#CE1141', secondary: '#000000' },
      cle: { primary: '#860038', secondary: '#FDBB30' },
      dal: { primary: '#00538C', secondary: '#002B5E' },
      den: { primary: '#0E2240', secondary: '#FEC524' },
      det: { primary: '#C8102E', secondary: '#1D42BA' },
      gsw: { primary: '#1D428A', secondary: '#FFC72C' },
      hou: { primary: '#CE1141', secondary: '#000000' },
      ind: { primary: '#002D62', secondary: '#FDBB30' },
      lac: { primary: '#C8102E', secondary: '#1D428A' },
      lal: { primary: '#552583', secondary: '#FDB927' },
      mem: { primary: '#5D76A9', secondary: '#12173F' },
      mia: { primary: '#98002E', secondary: '#F9A01B' },
      mil: { primary: '#00471B', secondary: '#EEE1C6' },
      min: { primary: '#0C2340', secondary: '#236192' },
      nop: { primary: '#0C2340', secondary: '#C8102E' },
      nyk: { primary: '#006BB6', secondary: '#F58426' },
      okc: { primary: '#007AC1', secondary: '#EF6100' },
      orl: { primary: '#0077C0', secondary: '#C4CED4' },
      phi: { primary: '#006BB6', secondary: '#ED174C' },
      phx: { primary: '#1D1160', secondary: '#E56020' },
      por: { primary: '#E03A3E', secondary: '#000000' },
      sac: { primary: '#5A2D81', secondary: '#63727A' },
      sas: { primary: '#C4CED4', secondary: '#000000' },
      tor: { primary: '#CE1141', secondary: '#000000' },
      uta: { primary: '#002B5C', secondary: '#00471B' },
      wsh: { primary: '#002B5C', secondary: '#E31837' },
    };
    return TEAM_COLORS[slug] || { primary: '#666666', secondary: '#999999' };
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
