// ============================================================
// Na Quadra — Database Seed: Teams (MySQL)
// All 30 NBA teams with real data
// ============================================================

export interface TeamSeedData {
  id: string;
  externalId: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: 'east' | 'west';
  division: string;
  colorPrimary: string;
  colorSecondary: string;
  logo: string;
  arena: string;
  founded: number;
  championships: number;
}

export const TEAMS_SEED: TeamSeedData[] = [
  // ── Eastern Conference ──
  { id: 'atl', externalId: '1', name: 'Atlanta Hawks', abbreviation: 'ATL', city: 'Atlanta', conference: 'east', division: 'Southeast', colorPrimary: '#E03A3E', colorSecondary: '#C1D32F', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/atl.png', arena: 'State Farm Arena', founded: 1946, championships: 1 },
  { id: 'bos', externalId: '2', name: 'Boston Celtics', abbreviation: 'BOS', city: 'Boston', conference: 'east', division: 'Atlantic', colorPrimary: '#007A33', colorSecondary: '#BA9653', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png', arena: 'TD Garden', founded: 1946, championships: 18 },
  { id: 'bkn', externalId: '17', name: 'Brooklyn Nets', abbreviation: 'BKN', city: 'Brooklyn', conference: 'east', division: 'Atlantic', colorPrimary: '#000000', colorSecondary: '#FFFFFF', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png', arena: 'Barclays Center', founded: 1967, championships: 0 },
  { id: 'cha', externalId: '30', name: 'Charlotte Hornets', abbreviation: 'CHA', city: 'Charlotte', conference: 'east', division: 'Southeast', colorPrimary: '#1D1160', colorSecondary: '#00788C', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png', arena: 'Spectrum Center', founded: 1988, championships: 0 },
  { id: 'chi', externalId: '4', name: 'Chicago Bulls', abbreviation: 'CHI', city: 'Chicago', conference: 'east', division: 'Central', colorPrimary: '#CE1141', colorSecondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png', arena: 'United Center', founded: 1966, championships: 6 },
  { id: 'cle', externalId: '5', name: 'Cleveland Cavaliers', abbreviation: 'CLE', city: 'Cleveland', conference: 'east', division: 'Central', colorPrimary: '#860038', colorSecondary: '#FDBB30', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png', arena: 'Rocket Mortgage FieldHouse', founded: 1970, championships: 1 },
  { id: 'det', externalId: '8', name: 'Detroit Pistons', abbreviation: 'DET', city: 'Detroit', conference: 'east', division: 'Central', colorPrimary: '#C8102E', colorSecondary: '#1D42BA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png', arena: 'Little Caesars Arena', founded: 1941, championships: 3 },
  { id: 'ind', externalId: '11', name: 'Indiana Pacers', abbreviation: 'IND', city: 'Indiana', conference: 'east', division: 'Central', colorPrimary: '#002D62', colorSecondary: '#FDBB30', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png', arena: 'Gainbridge Fieldhouse', founded: 1967, championships: 0 },
  { id: 'mia', externalId: '14', name: 'Miami Heat', abbreviation: 'MIA', city: 'Miami', conference: 'east', division: 'Southeast', colorPrimary: '#98002E', colorSecondary: '#F9A01B', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png', arena: 'Kaseya Center', founded: 1988, championships: 3 },
  { id: 'mil', externalId: '15', name: 'Milwaukee Bucks', abbreviation: 'MIL', city: 'Milwaukee', conference: 'east', division: 'Central', colorPrimary: '#00471B', colorSecondary: '#EEE1C6', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png', arena: 'Fiserv Forum', founded: 1968, championships: 2 },
  { id: 'nyk', externalId: '18', name: 'New York Knicks', abbreviation: 'NYK', city: 'New York', conference: 'east', division: 'Atlantic', colorPrimary: '#006BB6', colorSecondary: '#F58426', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png', arena: 'Madison Square Garden', founded: 1946, championships: 2 },
  { id: 'orl', externalId: '19', name: 'Orlando Magic', abbreviation: 'ORL', city: 'Orlando', conference: 'east', division: 'Southeast', colorPrimary: '#0077C0', colorSecondary: '#C4CED4', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png', arena: 'Amway Center', founded: 1989, championships: 0 },
  { id: 'phi', externalId: '20', name: 'Philadelphia 76ers', abbreviation: 'PHI', city: 'Philadelphia', conference: 'east', division: 'Atlantic', colorPrimary: '#006BB6', colorSecondary: '#ED174C', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png', arena: 'Wells Fargo Center', founded: 1946, championships: 3 },
  { id: 'tor', externalId: '28', name: 'Toronto Raptors', abbreviation: 'TOR', city: 'Toronto', conference: 'east', division: 'Atlantic', colorPrimary: '#CE1141', colorSecondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png', arena: 'Scotiabank Arena', founded: 1995, championships: 1 },
  { id: 'was', externalId: '27', name: 'Washington Wizards', abbreviation: 'WAS', city: 'Washington', conference: 'east', division: 'Southeast', colorPrimary: '#002B5C', colorSecondary: '#E31837', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png', arena: 'Capital One Arena', founded: 1961, championships: 1 },
  // ── Western Conference ──
  { id: 'dal', externalId: '6', name: 'Dallas Mavericks', abbreviation: 'DAL', city: 'Dallas', conference: 'west', division: 'Southwest', colorPrimary: '#00538C', colorSecondary: '#002B5E', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png', arena: 'American Airlines Center', founded: 1980, championships: 1 },
  { id: 'den', externalId: '7', name: 'Denver Nuggets', abbreviation: 'DEN', city: 'Denver', conference: 'west', division: 'Northwest', colorPrimary: '#0E2240', colorSecondary: '#FEC524', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png', arena: 'Ball Arena', founded: 1967, championships: 1 },
  { id: 'gsw', externalId: '9', name: 'Golden State Warriors', abbreviation: 'GSW', city: 'San Francisco', conference: 'west', division: 'Pacific', colorPrimary: '#1D428A', colorSecondary: '#FFC72C', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png', arena: 'Chase Center', founded: 1946, championships: 7 },
  { id: 'hou', externalId: '10', name: 'Houston Rockets', abbreviation: 'HOU', city: 'Houston', conference: 'west', division: 'Southwest', colorPrimary: '#CE1141', colorSecondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png', arena: 'Toyota Center', founded: 1967, championships: 2 },
  { id: 'lac', externalId: '12', name: 'LA Clippers', abbreviation: 'LAC', city: 'Los Angeles', conference: 'west', division: 'Pacific', colorPrimary: '#C8102E', colorSecondary: '#1D428A', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png', arena: 'Intuit Dome', founded: 1970, championships: 0 },
  { id: 'lal', externalId: '13', name: 'Los Angeles Lakers', abbreviation: 'LAL', city: 'Los Angeles', conference: 'west', division: 'Pacific', colorPrimary: '#552583', colorSecondary: '#FDB927', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png', arena: 'Crypto.com Arena', founded: 1947, championships: 17 },
  { id: 'mem', externalId: '29', name: 'Memphis Grizzlies', abbreviation: 'MEM', city: 'Memphis', conference: 'west', division: 'Southwest', colorPrimary: '#5D76A9', colorSecondary: '#12173F', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png', arena: 'FedExForum', founded: 1995, championships: 0 },
  { id: 'min', externalId: '16', name: 'Minnesota Timberwolves', abbreviation: 'MIN', city: 'Minnesota', conference: 'west', division: 'Northwest', colorPrimary: '#0C2340', colorSecondary: '#236192', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png', arena: 'Target Center', founded: 1989, championships: 0 },
  { id: 'nop', externalId: '3', name: 'New Orleans Pelicans', abbreviation: 'NOP', city: 'New Orleans', conference: 'west', division: 'Southwest', colorPrimary: '#0C2340', colorSecondary: '#C8102E', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/no.png', arena: 'Smoothie King Center', founded: 2002, championships: 0 },
  { id: 'okc', externalId: '25', name: 'Oklahoma City Thunder', abbreviation: 'OKC', city: 'Oklahoma City', conference: 'west', division: 'Northwest', colorPrimary: '#007AC1', colorSecondary: '#EF6100', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png', arena: 'Paycom Center', founded: 1967, championships: 1 },
  { id: 'phx', externalId: '21', name: 'Phoenix Suns', abbreviation: 'PHX', city: 'Phoenix', conference: 'west', division: 'Pacific', colorPrimary: '#1D1160', colorSecondary: '#E56020', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png', arena: 'Footprint Center', founded: 1968, championships: 0 },
  { id: 'por', externalId: '22', name: 'Portland Trail Blazers', abbreviation: 'POR', city: 'Portland', conference: 'west', division: 'Northwest', colorPrimary: '#E03A3E', colorSecondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/por.png', arena: 'Moda Center', founded: 1970, championships: 1 },
  { id: 'sac', externalId: '23', name: 'Sacramento Kings', abbreviation: 'SAC', city: 'Sacramento', conference: 'west', division: 'Pacific', colorPrimary: '#5A2D81', colorSecondary: '#63727A', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png', arena: 'Golden 1 Center', founded: 1923, championships: 1 },
  { id: 'sas', externalId: '24', name: 'San Antonio Spurs', abbreviation: 'SAS', city: 'San Antonio', conference: 'west', division: 'Southwest', colorPrimary: '#C4CED4', colorSecondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png', arena: 'Frost Bank Center', founded: 1967, championships: 5 },
  { id: 'uta', externalId: '26', name: 'Utah Jazz', abbreviation: 'UTA', city: 'Salt Lake City', conference: 'west', division: 'Northwest', colorPrimary: '#002B5C', colorSecondary: '#00471B', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/uta.png', arena: 'Delta Center', founded: 1974, championships: 0 },
];
