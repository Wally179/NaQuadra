// ============================================================
// Na Quadra — Shared Types: Game Insight (AI-ready)
// ============================================================
// These types prepare the architecture for a future AI layer
// that will generate narratives, curiosities and analysis.
// ============================================================

import type {
  GameSummary,
  GameTeamStatsComparison,
  GamePlayerStatsGroup,
  GamePlayByPlayEvent,
  HeadToHeadGame,
  PlayerSeasonPreview,
  RecentGameResult,
} from './game';

/**
 * Complete context payload for an AI to generate
 * insights, curiosities and game analysis.
 */
export interface GameInsightContext {
  gameId: string;
  gameDate: string;
  phase: 'pre-game' | 'live' | 'post-game';

  gameSummary: GameSummary;

  teamsHistory: {
    home: TeamHistoryContext;
    away: TeamHistoryContext;
  };

  lastMatchups: HeadToHeadGame[];

  keyPlayers: {
    home: PlayerSeasonPreview[];
    away: PlayerSeasonPreview[];
  };

  periodStats: PeriodInsight[] | null;
  fullBoxScore: GamePlayerStatsGroup | null;
  fullTeamStats: GameTeamStatsComparison | null;
  fullPlayByPlay: GamePlayByPlayEvent[] | null;

  keyMoments: KeyMoment[] | null;
}

/** Historical context for a team */
export interface TeamHistoryContext {
  teamId: string;
  teamName: string;
  record: string;
  homeRecord: string | null;
  awayRecord: string | null;
  streak: string | null;
  last10: string | null;
  recentForm: RecentGameResult[];
  conferenceRank: number | null;
}

/** Per-period insight for AI analysis */
export interface PeriodInsight {
  period: number;
  label: string;
  homeScore: number;
  awayScore: number;
  scoringRuns: string[];
  topScorer: { name: string; points: number } | null;
  turnovers: { home: number; away: number };
}

/** Algorithmically-detected key moment */
export interface KeyMoment {
  period: number;
  clock: string;
  type: 'lead-change' | 'scoring-run' | 'momentum-shift' | 'clutch-play';
  description: string;
  homeScore: number;
  awayScore: number;
}
