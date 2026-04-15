// ============================================================
// Na Quadra — All 30 NBA Team Colors & Data
// ============================================================

import type { TeamColors } from '@naquadra/types';

export interface TeamStaticData {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: 'east' | 'west';
  division: string;
  colors: TeamColors;
  logo: string;
}

export const NBA_TEAMS: Record<string, TeamStaticData> = {
  // === EASTERN CONFERENCE ===
  // Atlantic
  bos: {
    id: 'bos',
    name: 'Boston Celtics',
    abbreviation: 'BOS',
    city: 'Boston',
    conference: 'east',
    division: 'Atlantic',
    colors: { primary: '#007A33', secondary: '#BA9653' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
  },
  bkn: {
    id: 'bkn',
    name: 'Brooklyn Nets',
    abbreviation: 'BKN',
    city: 'Brooklyn',
    conference: 'east',
    division: 'Atlantic',
    colors: { primary: '#FFFFFF', secondary: '#777D84' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
  },
  nyk: {
    id: 'nyk',
    name: 'New York Knicks',
    abbreviation: 'NYK',
    city: 'New York',
    conference: 'east',
    division: 'Atlantic',
    colors: { primary: '#006BB6', secondary: '#F58426' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png',
  },
  phi: {
    id: 'phi',
    name: 'Philadelphia 76ers',
    abbreviation: 'PHI',
    city: 'Philadelphia',
    conference: 'east',
    division: 'Atlantic',
    colors: { primary: '#006BB6', secondary: '#ED174C' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
  },
  tor: {
    id: 'tor',
    name: 'Toronto Raptors',
    abbreviation: 'TOR',
    city: 'Toronto',
    conference: 'east',
    division: 'Atlantic',
    colors: { primary: '#CE1141', secondary: '#000000' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
  },
  // Central
  chi: {
    id: 'chi',
    name: 'Chicago Bulls',
    abbreviation: 'CHI',
    city: 'Chicago',
    conference: 'east',
    division: 'Central',
    colors: { primary: '#CE1141', secondary: '#000000' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
  },
  cle: {
    id: 'cle',
    name: 'Cleveland Cavaliers',
    abbreviation: 'CLE',
    city: 'Cleveland',
    conference: 'east',
    division: 'Central',
    colors: { primary: '#860038', secondary: '#FDBB30' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
  },
  det: {
    id: 'det',
    name: 'Detroit Pistons',
    abbreviation: 'DET',
    city: 'Detroit',
    conference: 'east',
    division: 'Central',
    colors: { primary: '#C8102E', secondary: '#1D42BA' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png',
  },
  ind: {
    id: 'ind',
    name: 'Indiana Pacers',
    abbreviation: 'IND',
    city: 'Indiana',
    conference: 'east',
    division: 'Central',
    colors: { primary: '#002D62', secondary: '#FDBB30' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
  },
  mil: {
    id: 'mil',
    name: 'Milwaukee Bucks',
    abbreviation: 'MIL',
    city: 'Milwaukee',
    conference: 'east',
    division: 'Central',
    colors: { primary: '#00471B', secondary: '#EEE1C6' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
  },
  // Southeast
  atl: {
    id: 'atl',
    name: 'Atlanta Hawks',
    abbreviation: 'ATL',
    city: 'Atlanta',
    conference: 'east',
    division: 'Southeast',
    colors: { primary: '#E03A3E', secondary: '#C1D32F' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png',
  },
  cha: {
    id: 'cha',
    name: 'Charlotte Hornets',
    abbreviation: 'CHA',
    city: 'Charlotte',
    conference: 'east',
    division: 'Southeast',
    colors: { primary: '#1D1160', secondary: '#00788C' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
  },
  mia: {
    id: 'mia',
    name: 'Miami Heat',
    abbreviation: 'MIA',
    city: 'Miami',
    conference: 'east',
    division: 'Southeast',
    colors: { primary: '#98002E', secondary: '#F9A01B' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
  },
  orl: {
    id: 'orl',
    name: 'Orlando Magic',
    abbreviation: 'ORL',
    city: 'Orlando',
    conference: 'east',
    division: 'Southeast',
    colors: { primary: '#0077C0', secondary: '#C4CED4' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png',
  },
  wsh: {
    id: 'wsh',
    name: 'Washington Wizards',
    abbreviation: 'WAS',
    city: 'Washington',
    conference: 'east',
    division: 'Southeast',
    colors: { primary: '#002B5C', secondary: '#E31837' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png',
  },

  // === WESTERN CONFERENCE ===
  // Northwest
  den: {
    id: 'den',
    name: 'Denver Nuggets',
    abbreviation: 'DEN',
    city: 'Denver',
    conference: 'west',
    division: 'Northwest',
    colors: { primary: '#0E2240', secondary: '#FEC524' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
  },
  min: {
    id: 'min',
    name: 'Minnesota Timberwolves',
    abbreviation: 'MIN',
    city: 'Minnesota',
    conference: 'west',
    division: 'Northwest',
    colors: { primary: '#0C2340', secondary: '#236192' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
  },
  okc: {
    id: 'okc',
    name: 'Oklahoma City Thunder',
    abbreviation: 'OKC',
    city: 'Oklahoma City',
    conference: 'west',
    division: 'Northwest',
    colors: { primary: '#007AC1', secondary: '#EF6100' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
  },
  por: {
    id: 'por',
    name: 'Portland Trail Blazers',
    abbreviation: 'POR',
    city: 'Portland',
    conference: 'west',
    division: 'Northwest',
    colors: { primary: '#E03A3E', secondary: '#000000' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/por.png',
  },
  uta: {
    id: 'uta',
    name: 'Utah Jazz',
    abbreviation: 'UTA',
    city: 'Utah',
    conference: 'west',
    division: 'Northwest',
    colors: { primary: '#002B5C', secondary: '#00471B' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/uta.png',
  },
  // Pacific
  gsw: {
    id: 'gsw',
    name: 'Golden State Warriors',
    abbreviation: 'GSW',
    city: 'Golden State',
    conference: 'west',
    division: 'Pacific',
    colors: { primary: '#1D428A', secondary: '#FFC72C' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
  },
  lac: {
    id: 'lac',
    name: 'LA Clippers',
    abbreviation: 'LAC',
    city: 'Los Angeles',
    conference: 'west',
    division: 'Pacific',
    colors: { primary: '#C8102E', secondary: '#1D428A' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
  },
  lal: {
    id: 'lal',
    name: 'Los Angeles Lakers',
    abbreviation: 'LAL',
    city: 'Los Angeles',
    conference: 'west',
    division: 'Pacific',
    colors: { primary: '#552583', secondary: '#FDB927' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  },
  phx: {
    id: 'phx',
    name: 'Phoenix Suns',
    abbreviation: 'PHX',
    city: 'Phoenix',
    conference: 'west',
    division: 'Pacific',
    colors: { primary: '#1D1160', secondary: '#E56020' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
  },
  sac: {
    id: 'sac',
    name: 'Sacramento Kings',
    abbreviation: 'SAC',
    city: 'Sacramento',
    conference: 'west',
    division: 'Pacific',
    colors: { primary: '#5A2D81', secondary: '#63727A' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png',
  },
  // Southwest
  dal: {
    id: 'dal',
    name: 'Dallas Mavericks',
    abbreviation: 'DAL',
    city: 'Dallas',
    conference: 'west',
    division: 'Southwest',
    colors: { primary: '#00538C', secondary: '#002B5E' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
  },
  hou: {
    id: 'hou',
    name: 'Houston Rockets',
    abbreviation: 'HOU',
    city: 'Houston',
    conference: 'west',
    division: 'Southwest',
    colors: { primary: '#CE1141', secondary: '#000000' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
  },
  mem: {
    id: 'mem',
    name: 'Memphis Grizzlies',
    abbreviation: 'MEM',
    city: 'Memphis',
    conference: 'west',
    division: 'Southwest',
    colors: { primary: '#5D76A9', secondary: '#12173F' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png',
  },
  nop: {
    id: 'nop',
    name: 'New Orleans Pelicans',
    abbreviation: 'NOP',
    city: 'New Orleans',
    conference: 'west',
    division: 'Southwest',
    colors: { primary: '#0C2340', secondary: '#C8102E' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/no.png',
  },
  sas: {
    id: 'sas',
    name: 'San Antonio Spurs',
    abbreviation: 'SAS',
    city: 'San Antonio',
    conference: 'west',
    division: 'Southwest',
    colors: { primary: '#C4CED4', secondary: '#000000' },
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
  },
};

/** Get team by ID */
export function getTeam(teamId: string): TeamStaticData | undefined {
  return NBA_TEAMS[teamId.toLowerCase()];
}

/** Get team colors by ID */
export function getTeamColors(teamId: string): TeamColors | undefined {
  return NBA_TEAMS[teamId.toLowerCase()]?.colors;
}

/** Get all teams as array */
export function getAllTeams(): TeamStaticData[] {
  return Object.values(NBA_TEAMS);
}

/** Get teams by conference */
export function getTeamsByConference(conference: 'east' | 'west'): TeamStaticData[] {
  return Object.values(NBA_TEAMS).filter((t) => t.conference === conference);
}
