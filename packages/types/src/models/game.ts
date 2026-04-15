// ============================================================
// Na Quadra — Shared Types: Game
// ============================================================

export type GameStatus = 'scheduled' | 'live' | 'final';

export type SeasonPhase =
  | 'preseason'
  | 'regular'
  | 'play-in'
  | 'first-round'
  | 'conference-semis'
  | 'conference-finals'
  | 'finals';

export interface NormalizedGame {
  externalId: string;
  date: string;
  startTime: string;
  status: GameStatus;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  homeRecord: string;
  awayRecord: string;
  quarter: string | null;
  clock: string | null;
  conference: string;
  phase: SeasonPhase;
  seriesInfo: string | null;
  venue: string | null;
  broadcast: string | null;
  lastUpdated: string;
}
