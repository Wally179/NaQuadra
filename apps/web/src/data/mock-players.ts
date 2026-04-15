// ============================================================
// Na Quadra — Mock Data: Players
// ============================================================

export interface MockPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  teamId: string;
  number: number;
  position: string;
  height: string;
  weight: string;
  birthDate: string;
  country: string;
  draftYear: number | null;
  draftPick: number | null;
  bio: string;
  headshot: string;
  currentStats: {
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
  };
}

export const MOCK_PLAYERS: MockPlayer[] = [
  {
    id: 'lebron-james',
    name: 'LeBron James',
    firstName: 'LeBron',
    lastName: 'James',
    teamId: 'lal',
    number: 23,
    position: 'SF',
    height: '2,06m',
    weight: '113kg',
    birthDate: '1984-12-30',
    country: 'EUA',
    draftYear: 2003,
    draftPick: 1,
    bio: 'Considerado por muitos o maior jogador de todos os tempos, LeBron James é o maior pontuador da história da NBA. Nascido em Akron, Ohio, foi selecionado com a primeira escolha do Draft de 2003 pelo Cleveland Cavaliers com apenas 18 anos.',
    headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/1966.png',
    currentStats: { season: '2025-26', gamesPlayed: 71, minutesPg: 35.5, ppg: 25.8, rpg: 7.3, apg: 8.1, spg: 1.3, bpg: 0.6, fgPct: 0.521, threePct: 0.412, ftPct: 0.751 },
  },
  {
    id: 'jayson-tatum',
    name: 'Jayson Tatum',
    firstName: 'Jayson',
    lastName: 'Tatum',
    teamId: 'bos',
    number: 0,
    position: 'SF',
    height: '2,03m',
    weight: '95kg',
    birthDate: '1998-03-03',
    country: 'EUA',
    draftYear: 2017,
    draftPick: 3,
    bio: 'Jayson Tatum é o líder absoluto dos Boston Celtics e um dos melhores jogadores da NBA atualmente. Campeão com os Celtics em 2024, o ala de St. Louis é conhecido por seu jogo versátil e frieza nos momentos decisivos.',
    headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3899274.png',
    currentStats: { season: '2025-26', gamesPlayed: 74, minutesPg: 36.2, ppg: 28.4, rpg: 8.7, apg: 4.9, spg: 1.1, bpg: 0.6, fgPct: 0.478, threePct: 0.381, ftPct: 0.832 },
  },
  {
    id: 'shai-gilgeous-alexander',
    name: 'Shai Gilgeous-Alexander',
    firstName: 'Shai',
    lastName: 'Gilgeous-Alexander',
    teamId: 'okc',
    number: 2,
    position: 'PG',
    height: '1,98m',
    weight: '88kg',
    birthDate: '1998-07-12',
    country: 'Canadá',
    draftYear: 2018,
    draftPick: 11,
    bio: 'Shai Gilgeous-Alexander, ou SGA, é o líder do Oklahoma City Thunder e candidato ao prêmio de MVP. O armador canadense é conhecido por sua capacidade de chegar à linha de lance livre e sua eficiência impressionante.',
    headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3936299.png',
    currentStats: { season: '2025-26', gamesPlayed: 75, minutesPg: 33.8, ppg: 31.2, rpg: 5.4, apg: 6.2, spg: 1.8, bpg: 0.9, fgPct: 0.536, threePct: 0.342, ftPct: 0.878 },
  },
  {
    id: 'nikola-jokic',
    name: 'Nikola Jokić',
    firstName: 'Nikola',
    lastName: 'Jokić',
    teamId: 'den',
    number: 15,
    position: 'C',
    height: '2,11m',
    weight: '129kg',
    birthDate: '1995-02-19',
    country: 'Sérvia',
    draftYear: 2014,
    draftPick: 41,
    bio: 'Nikola Jokić é amplamente considerado o melhor jogador do mundo. O pivô sérvio revolucionou a posição com seu QI de jogo excepcional, visão de passe e capacidade de dominar todas as facetas do jogo. Tricampeão do prêmio de MVP.',
    headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3112335.png',
    currentStats: { season: '2025-26', gamesPlayed: 72, minutesPg: 34.1, ppg: 26.5, rpg: 12.8, apg: 9.2, spg: 1.4, bpg: 0.9, fgPct: 0.579, threePct: 0.358, ftPct: 0.816 },
  },
  {
    id: 'victor-wembanyama',
    name: 'Victor Wembanyama',
    firstName: 'Victor',
    lastName: 'Wembanyama',
    teamId: 'sas',
    number: 1,
    position: 'C',
    height: '2,24m',
    weight: '95kg',
    birthDate: '2004-01-04',
    country: 'França',
    draftYear: 2023,
    draftPick: 1,
    bio: 'Victor Wembanyama é considerado o prospecto mais especial da história do basquete. Com 2,24m de altura, envergadura de 2,43m e habilidade para arremessar de 3 pontos, o francês está redefinindo o que é possível para um pivô.',
    headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4433190.png',
    currentStats: { season: '2025-26', gamesPlayed: 69, minutesPg: 32.5, ppg: 23.1, rpg: 10.6, apg: 3.8, spg: 1.5, bpg: 3.6, fgPct: 0.498, threePct: 0.351, ftPct: 0.789 },
  },
  {
    id: 'anthony-davis',
    name: 'Anthony Davis',
    firstName: 'Anthony',
    lastName: 'Davis',
    teamId: 'lal',
    number: 3,
    position: 'PF',
    height: '2,08m',
    weight: '115kg',
    birthDate: '1993-03-11',
    country: 'EUA',
    draftYear: 2012,
    draftPick: 1,
    bio: 'Anthony Davis é um dos pivôs mais dominantes da NBA. Campeão com os Lakers em 2020, o "Sobrancelhas" é temido pela combinação de habilidade ofensiva e impacto defensivo.',
    headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6583.png',
    currentStats: { season: '2025-26', gamesPlayed: 68, minutesPg: 34.8, ppg: 24.9, rpg: 12.4, apg: 3.5, spg: 1.2, bpg: 2.3, fgPct: 0.551, threePct: 0.241, ftPct: 0.768 },
  },
];

export function getPlayer(playerId: string): MockPlayer | undefined {
  return MOCK_PLAYERS.find((p) => p.id === playerId);
}

export function getPlayersByTeam(teamId: string): MockPlayer[] {
  return MOCK_PLAYERS.filter((p) => p.teamId === teamId);
}
