// ============================================================
// Na Quadra — ESPN Team ID Mapping
// Maps ESPN numeric team IDs to our app slugs and vice versa.
// Also maps ESPN abbreviations to our slugs.
// ============================================================

interface TeamMapping {
  espnId: string;
  slug: string;
  espnAbbr: string;
  name: string;
}

const TEAM_MAPPINGS: TeamMapping[] = [
  // Eastern Conference
  { espnId: '1',  slug: 'atl', espnAbbr: 'ATL', name: 'Atlanta Hawks' },
  { espnId: '2',  slug: 'bos', espnAbbr: 'BOS', name: 'Boston Celtics' },
  { espnId: '17', slug: 'bkn', espnAbbr: 'BKN', name: 'Brooklyn Nets' },
  { espnId: '30', slug: 'cha', espnAbbr: 'CHA', name: 'Charlotte Hornets' },
  { espnId: '4',  slug: 'chi', espnAbbr: 'CHI', name: 'Chicago Bulls' },
  { espnId: '5',  slug: 'cle', espnAbbr: 'CLE', name: 'Cleveland Cavaliers' },
  { espnId: '8',  slug: 'det', espnAbbr: 'DET', name: 'Detroit Pistons' },
  { espnId: '11', slug: 'ind', espnAbbr: 'IND', name: 'Indiana Pacers' },
  { espnId: '14', slug: 'mia', espnAbbr: 'MIA', name: 'Miami Heat' },
  { espnId: '15', slug: 'mil', espnAbbr: 'MIL', name: 'Milwaukee Bucks' },
  { espnId: '18', slug: 'nyk', espnAbbr: 'NY',  name: 'New York Knicks' },
  { espnId: '19', slug: 'orl', espnAbbr: 'ORL', name: 'Orlando Magic' },
  { espnId: '20', slug: 'phi', espnAbbr: 'PHI', name: 'Philadelphia 76ers' },
  { espnId: '28', slug: 'tor', espnAbbr: 'TOR', name: 'Toronto Raptors' },
  { espnId: '27', slug: 'wsh', espnAbbr: 'WSH', name: 'Washington Wizards' },
  // Western Conference
  { espnId: '6',  slug: 'dal', espnAbbr: 'DAL', name: 'Dallas Mavericks' },
  { espnId: '7',  slug: 'den', espnAbbr: 'DEN', name: 'Denver Nuggets' },
  { espnId: '9',  slug: 'gsw', espnAbbr: 'GS',  name: 'Golden State Warriors' },
  { espnId: '10', slug: 'hou', espnAbbr: 'HOU', name: 'Houston Rockets' },
  { espnId: '12', slug: 'lac', espnAbbr: 'LAC', name: 'LA Clippers' },
  { espnId: '13', slug: 'lal', espnAbbr: 'LAL', name: 'Los Angeles Lakers' },
  { espnId: '29', slug: 'mem', espnAbbr: 'MEM', name: 'Memphis Grizzlies' },
  { espnId: '16', slug: 'min', espnAbbr: 'MIN', name: 'Minnesota Timberwolves' },
  { espnId: '3',  slug: 'nop', espnAbbr: 'NO',  name: 'New Orleans Pelicans' },
  { espnId: '25', slug: 'okc', espnAbbr: 'OKC', name: 'Oklahoma City Thunder' },
  { espnId: '21', slug: 'phx', espnAbbr: 'PHX', name: 'Phoenix Suns' },
  { espnId: '22', slug: 'por', espnAbbr: 'POR', name: 'Portland Trail Blazers' },
  { espnId: '23', slug: 'sac', espnAbbr: 'SAC', name: 'Sacramento Kings' },
  { espnId: '24', slug: 'sas', espnAbbr: 'SA',  name: 'San Antonio Spurs' },
  { espnId: '26', slug: 'uta', espnAbbr: 'UTAH', name: 'Utah Jazz' },
];

// Lookup maps
const byEspnId = new Map<string, TeamMapping>();
const bySlug = new Map<string, TeamMapping>();
const byEspnAbbr = new Map<string, TeamMapping>();

for (const t of TEAM_MAPPINGS) {
  byEspnId.set(t.espnId, t);
  bySlug.set(t.slug, t);
  byEspnAbbr.set(t.espnAbbr.toUpperCase(), t);
}

/** Convert ESPN numeric ID to app slug (e.g., '2' → 'bos') */
export function espnIdToSlug(espnId: string): string {
  return byEspnId.get(espnId)?.slug ?? espnId.toLowerCase();
}

/** Convert ESPN abbreviation to app slug (e.g., 'GS' → 'gsw') */
export function espnAbbrToSlug(espnAbbr: string): string {
  return byEspnAbbr.get(espnAbbr.toUpperCase())?.slug ?? espnAbbr.toLowerCase();
}

/** Convert app slug to ESPN numeric ID (e.g., 'bos' → '2') */
export function slugToEspnId(slug: string): string {
  return bySlug.get(slug)?.espnId ?? slug;
}

/** Get all mappings */
export function getAllMappings(): TeamMapping[] {
  return TEAM_MAPPINGS;
}
