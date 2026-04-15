// ============================================================
// Na Quadra — Shared Types: Standings
// ============================================================

import type { Conference } from './team';

export interface StandingsEntry {
  teamId: string;
  teamName: string;
  teamAbbreviation: string;
  conference: Conference;
  division: string;
  seed: number;
  wins: number;
  losses: number;
  pct: number;
  gamesBehind: string;
  streak: string;
  last10: string;
  homeRecord: string;
  awayRecord: string;
  pointsFor: number;
  pointsAgainst: number;
  lastUpdated: string;
}

export interface NormalizedStandings {
  season: string;
  east: StandingsEntry[];
  west: StandingsEntry[];
  lastUpdated: string;
}
