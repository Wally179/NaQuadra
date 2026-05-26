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
  | 'finals'
  | 'playoffs';

// ── Legacy type (kept for backward compat with ScoreboardBar) ──
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

// ── Team info within a game context ──

export interface GameTeamInfo {
  /** NaQuadra slug (e.g. "lal") */
  id: string;
  /** Full name (e.g. "Los Angeles Lakers") */
  name: string;
  /** Abbreviation (e.g. "LAL") */
  abbreviation: string;
  /** Logo URL */
  logo: string;
  /** Season record (e.g. "45-20") */
  record: string;
  /** Team colors */
  colors: { primary: string; secondary: string };
}

// ── Period scores ──

export interface PeriodScore {
  period: number;
  label: string;       // "Q1", "Q2", ..., "OT1"
  homeScore: number;
  awayScore: number;
}

// ── Game Summary — list item ──

/** Summary of a game as shown in the games list */
export interface GameSummary {
  /** ESPN event ID (e.g. "401656789") */
  id: string;
  /** ISO date of the game */
  date: string;
  /** ISO start time */
  startTime: string;
  /** Game status */
  status: GameStatus;

  // Teams
  homeTeam: GameTeamInfo;
  awayTeam: GameTeamInfo;

  // Score
  homeScore: number | null;
  awayScore: number | null;

  // Live info
  period: number | null;
  clock: string | null;

  // Meta
  venue: string | null;
  broadcast: string | null;
  seriesInfo: string | null;

  /** Per-period scores: [Q1, Q2, Q3, Q4, OT1, ...] */
  periodScores: PeriodScore[] | null;
}

// ── Game Detail — full view ──

/** Full game detail (pre/live/post) */
export interface GameDetail {
  summary: GameSummary;
  teamStats: GameTeamStatsComparison | null;
  leaders: GameLeadersData | null;
  playerStats: GamePlayerStatsGroup | null;
  preview: GamePreview | null;
}

// ── Pre-game preview (BallDontLie enrichment) ──

export interface GamePreview {
  homeRecentForm: RecentGameResult[];
  awayRecentForm: RecentGameResult[];
  headToHead: HeadToHeadGame[];
  homeKeyPlayers: PlayerSeasonPreview[];
  awayKeyPlayers: PlayerSeasonPreview[];
}

export interface RecentGameResult {
  date: string;
  opponentId: string;
  opponentName: string;
  result: 'W' | 'L';
  score: string;        // "110-105"
  isHome: boolean;
}

export interface HeadToHeadGame {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  winnerId: string;
}

export interface PlayerSeasonPreview {
  playerId: string;
  playerName: string;
  headshot: string | null;
  position: string;
  gamesPlayed: number;
  ppg: number;
  rpg: number;
  apg: number;
  fgPct: number;
  threePct: number;
}

// ── Team Stats (in-game / post-game) ──

export interface GameTeamStats {
  teamId: string;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  fieldGoalPct: number;
  threePointMade: number;
  threePointAttempted: number;
  threePointPct: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  freeThrowPct: number;
  rebounds: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  totalPoints: number;
  fastBreakPoints: number | null;
  pointsInPaint: number | null;
  pointsOffTurnovers: number | null;
}

export interface GameTeamStatsComparison {
  home: GameTeamStats;
  away: GameTeamStats;
}

// ── Player Stats (box score) ──

export interface GamePlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  headshot: string | null;
  teamId: string;
  starter: boolean;
  minutes: string;
  points: number;
  rebounds: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  plusMinus: number | null;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointMade: number;
  threePointAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

export interface GamePlayerStatsGroup {
  home: {
    teamId: string;
    teamName: string;
    starters: GamePlayerStats[];
    bench: GamePlayerStats[];
  };
  away: {
    teamId: string;
    teamName: string;
    starters: GamePlayerStats[];
    bench: GamePlayerStats[];
  };
}

// ── Play-by-play ──

export type PlayEventType =
  | 'field-goal'
  | 'three-pointer'
  | 'free-throw'
  | 'rebound'
  | 'assist'
  | 'steal'
  | 'block'
  | 'turnover'
  | 'foul'
  | 'timeout'
  | 'substitution'
  | 'jump-ball'
  | 'violation'
  | 'other';

export interface GamePlayByPlayEvent {
  id: string;
  clock: string;
  period: number;
  description: string;
  teamId: string | null;
  type: PlayEventType;
  scoreValue: number | null;
  homeScore: number;
  awayScore: number;
  isScoring: boolean;
}

// ── Leaders ──

export interface GameLeader {
  playerId: string;
  playerName: string;
  headshot: string | null;
  teamId: string;
  value: number;
  displayValue: string;
}

export interface GameLeadersData {
  points: { home: GameLeader; away: GameLeader };
  rebounds: { home: GameLeader; away: GameLeader };
  assists: { home: GameLeader; away: GameLeader };
}
