// ============================================================
// Na Quadra — Shared Types: Player
// ============================================================

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface PlayerSeasonStats {
  season: string;
  gamesPlayed: number;
  minutesPg: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
}

export interface NormalizedPlayer {
  externalId: string;
  name: string;
  firstName: string;
  lastName: string;
  teamId: string;
  number: number;
  position: Position;
  height: string;
  weight: string;
  birthDate: string;
  country: string;
  draftYear: number | null;
  draftPick: number | null;
  bio?: string;
  headshot: string;
  currentStats?: PlayerSeasonStats;
  lastUpdated: string;
}
