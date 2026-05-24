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

/**
 * Player detail as returned by the NaQuadra backend
 * (sourced from ESPN Core API + team enrichment).
 */
export interface NormalizedPlayerDetail {
  externalId: string;
  name: string;
  jersey: string;
  position: string;
  headshot: string | null;
  height: string;
  weight: string;
  age: number;
  country: string;
  teamId: string;
  teamName: string;
  teamAbbr: string;
  teamLogo: string;
  draftInfo: string | null;
  experience: number | null;
}
