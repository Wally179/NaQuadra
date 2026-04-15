// ============================================================
// Na Quadra — Shared Types: Team
// ============================================================

export interface TeamColors {
  primary: string;
  secondary: string;
}

export interface NormalizedTeam {
  externalId: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: Conference;
  division: string;
  colors: TeamColors;
  logo: string;
  arena: string;
  founded: number;
  championships: number;
  history?: string;
  socialLinks?: Record<string, string>;
  lastUpdated: string;
}

export type Conference = 'east' | 'west';

export type Division =
  | 'atlantic'
  | 'central'
  | 'southeast'
  | 'northwest'
  | 'pacific'
  | 'southwest';
