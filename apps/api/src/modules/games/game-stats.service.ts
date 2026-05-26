// ============================================================
// Na Quadra — Game Stats Service
// Normalizes ESPN summary data into typed game stats,
// box scores, and leaders.
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { EspnService } from '../espn/espn.service';
import { espnIdToSlug } from '../espn/team-mapping';
import type {
  GameTeamStats,
  GameTeamStatsComparison,
  GamePlayerStats,
  GamePlayerStatsGroup,
  GameLeader,
  GameLeadersData,
  PeriodScore,
} from '@naquadra/types';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class GameStatsService {
  private readonly logger = new Logger(GameStatsService.name);
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly espnService: EspnService) {}

  // ── Team Stats comparison ──
  async getTeamStats(eventId: string, isLive: boolean): Promise<GameTeamStatsComparison | null> {
    const cacheKey = `game:${eventId}:teamStats`;
    const ttl = isLive ? 15_000 : 24 * 60 * 60 * 1000; // 15s live, 24h final
    const cached = this.getFromCache<GameTeamStatsComparison>(cacheKey);
    if (cached) return cached;

    const summary = await this.espnService.getEventSummary(eventId);
    if (!summary) return null;

    try {
      const boxscore = summary.boxscore as any;
      if (!boxscore?.teams) return null;

      const teams = boxscore.teams as any[];
      if (teams.length < 2) return null;

      const parseTeamStats = (team: any): GameTeamStats => {
        const getStat = (name: string): number => {
          const stat = (team.statistics as any[])?.find((s: any) => s.name === name);
          return stat ? parseFloat(stat.displayValue) || 0 : 0;
        };

        return {
          teamId: espnIdToSlug(String(team.team?.id || '')),
          fieldGoalsMade: getStat('fieldGoalsMade'),
          fieldGoalsAttempted: getStat('fieldGoalsAttempted'),
          fieldGoalPct: getStat('fieldGoalPct'),
          threePointMade: getStat('threePointFieldGoalsMade'),
          threePointAttempted: getStat('threePointFieldGoalsAttempted'),
          threePointPct: getStat('threePointFieldGoalPct'),
          freeThrowsMade: getStat('freeThrowsMade'),
          freeThrowsAttempted: getStat('freeThrowsAttempted'),
          freeThrowPct: getStat('freeThrowPct'),
          rebounds: getStat('totalRebounds'),
          offensiveRebounds: getStat('offensiveRebounds'),
          defensiveRebounds: getStat('defensiveRebounds'),
          assists: getStat('assists'),
          steals: getStat('steals'),
          blocks: getStat('blocks'),
          turnovers: getStat('turnovers'),
          personalFouls: getStat('fouls'),
          totalPoints: getStat('points') || getStat('totalPoints'),
          fastBreakPoints: getStat('fastBreakPoints') || null,
          pointsInPaint: getStat('pointsInPaint') || null,
          pointsOffTurnovers: getStat('pointsOffTurnovers') || null,
        };
      };

      // ESPN summary: teams[0] is usually away, teams[1] is home.
      // But we determine by homeAway field if available, else by order.
      const result: GameTeamStatsComparison = {
        home: parseTeamStats(teams.find((t: any) => t.homeAway === 'home') || teams[1]),
        away: parseTeamStats(teams.find((t: any) => t.homeAway === 'away') || teams[0]),
      };

      this.setCache(cacheKey, result, ttl);
      return result;
    } catch (error) {
      this.logger.error(`Failed to parse team stats for ${eventId}`, (error as Error).message);
      return null;
    }
  }

  // ── Box score (player stats) ──
  async getPlayerStats(eventId: string, isLive: boolean): Promise<GamePlayerStatsGroup | null> {
    const cacheKey = `game:${eventId}:playerStats`;
    const ttl = isLive ? 15_000 : 24 * 60 * 60 * 1000;
    const cached = this.getFromCache<GamePlayerStatsGroup>(cacheKey);
    if (cached) return cached;

    const summary = await this.espnService.getEventSummary(eventId);
    if (!summary) return null;

    try {
      const boxscore = summary.boxscore as any;
      if (!boxscore?.players) return null;

      const playersData = boxscore.players as any[];
      if (playersData.length < 2) return null;

      const parsePlayerGroup = (teamData: any) => {
        const teamId = espnIdToSlug(String(teamData.team?.id || ''));
        const teamName = teamData.team?.displayName || '';

        const allPlayers: GamePlayerStats[] = [];
        for (const statGroup of (teamData.statistics || [])) {
          const statLabels: string[] = statGroup.labels || [];
          for (const athlete of (statGroup.athletes || [])) {
            const stats: string[] = athlete.stats || [];
            const getIdx = (label: string) => {
              const idx = statLabels.indexOf(label);
              return idx >= 0 ? stats[idx] : '0';
            };

            allPlayers.push({
              playerId: String(athlete.athlete?.id || ''),
              playerName: athlete.athlete?.displayName || athlete.athlete?.shortName || '',
              position: athlete.athlete?.position?.abbreviation || '',
              headshot: athlete.athlete?.headshot?.href || null,
              teamId,
              starter: athlete.starter ?? false,
              minutes: getIdx('MIN') || '0',
              points: parseInt(getIdx('PTS'), 10) || 0,
              rebounds: parseInt(getIdx('REB'), 10) || 0,
              offensiveRebounds: parseInt(getIdx('OREB'), 10) || 0,
              defensiveRebounds: parseInt(getIdx('DREB'), 10) || 0,
              assists: parseInt(getIdx('AST'), 10) || 0,
              steals: parseInt(getIdx('STL'), 10) || 0,
              blocks: parseInt(getIdx('BLK'), 10) || 0,
              turnovers: parseInt(getIdx('TO'), 10) || 0,
              personalFouls: parseInt(getIdx('PF'), 10) || 0,
              plusMinus: parseInt(getIdx('+/-'), 10) || null,
              fieldGoalsMade: parseInt((getIdx('FG') || '0-0').split('-')[0], 10) || 0,
              fieldGoalsAttempted: parseInt((getIdx('FG') || '0-0').split('-')[1], 10) || 0,
              threePointMade: parseInt((getIdx('3PT') || '0-0').split('-')[0], 10) || 0,
              threePointAttempted: parseInt((getIdx('3PT') || '0-0').split('-')[1], 10) || 0,
              freeThrowsMade: parseInt((getIdx('FT') || '0-0').split('-')[0], 10) || 0,
              freeThrowsAttempted: parseInt((getIdx('FT') || '0-0').split('-')[1], 10) || 0,
            });
          }
        }

        return {
          teamId,
          teamName,
          starters: allPlayers.filter((p) => p.starter),
          bench: allPlayers.filter((p) => !p.starter),
        };
      };

      const homeData = playersData.find((p: any) => p.homeAway === 'home') || playersData[1];
      const awayData = playersData.find((p: any) => p.homeAway === 'away') || playersData[0];

      const result: GamePlayerStatsGroup = {
        home: parsePlayerGroup(homeData),
        away: parsePlayerGroup(awayData),
      };

      this.setCache(cacheKey, result, ttl);
      return result;
    } catch (error) {
      this.logger.error(`Failed to parse player stats for ${eventId}`, (error as Error).message);
      return null;
    }
  }

  // ── Leaders ──
  async getLeaders(eventId: string, isLive: boolean): Promise<GameLeadersData | null> {
    const cacheKey = `game:${eventId}:leaders`;
    const ttl = isLive ? 15_000 : 24 * 60 * 60 * 1000;
    const cached = this.getFromCache<GameLeadersData>(cacheKey);
    if (cached) return cached;

    // Derive leaders from player stats
    const playerStats = await this.getPlayerStats(eventId, isLive);
    if (!playerStats) return null;

    const findLeader = (
      teamGroup: { teamId: string; starters: GamePlayerStats[]; bench: GamePlayerStats[] },
      stat: 'points' | 'rebounds' | 'assists',
    ): GameLeader => {
      const allPlayers = [...teamGroup.starters, ...teamGroup.bench];
      const sorted = [...allPlayers].sort((a, b) => b[stat] - a[stat]);
      const top = sorted[0];
      const labels = { points: 'PTS', rebounds: 'REB', assists: 'AST' };
      return {
        playerId: top?.playerId || '',
        playerName: top?.playerName || '',
        headshot: top?.headshot || null,
        teamId: teamGroup.teamId,
        value: top?.[stat] || 0,
        displayValue: `${top?.[stat] || 0} ${labels[stat]}`,
      };
    };

    const result: GameLeadersData = {
      points: {
        home: findLeader(playerStats.home, 'points'),
        away: findLeader(playerStats.away, 'points'),
      },
      rebounds: {
        home: findLeader(playerStats.home, 'rebounds'),
        away: findLeader(playerStats.away, 'rebounds'),
      },
      assists: {
        home: findLeader(playerStats.home, 'assists'),
        away: findLeader(playerStats.away, 'assists'),
      },
    };

    this.setCache(cacheKey, result, ttl);
    return result;
  }

  // ── Period scores ──
  async getPeriodScores(eventId: string, isLive: boolean): Promise<PeriodScore[] | null> {
    const cacheKey = `game:${eventId}:periodScores`;
    const ttl = isLive ? 15_000 : 24 * 60 * 60 * 1000;
    const cached = this.getFromCache<PeriodScore[]>(cacheKey);
    if (cached) return cached;

    const summary = await this.espnService.getEventSummary(eventId);
    if (!summary) return null;

    try {
      const header = summary.header as any;
      const competitions = header?.competitions as any[];
      if (!competitions?.length) return null;

      const competitors = competitions[0].competitors as any[];
      if (!competitors?.length) return null;

      const home = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
      const away = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

      const homeLinescores = home.linescores as any[] || [];
      const awayLinescores = away.linescores as any[] || [];

      const periods: PeriodScore[] = homeLinescores.map((ls: any, i: number) => ({
        period: i + 1,
        label: i < 4 ? `Q${i + 1}` : `OT${i - 3}`,
        homeScore: ls.value || 0,
        awayScore: awayLinescores[i]?.value || 0,
      }));

      this.setCache(cacheKey, periods, ttl);
      return periods;
    } catch (error) {
      this.logger.error(`Failed to parse period scores for ${eventId}`, (error as Error).message);
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
