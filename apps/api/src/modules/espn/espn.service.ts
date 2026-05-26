// ============================================================
// Na Quadra — ESPN Service
// Real integration with ESPN public APIs
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { espnIdToSlug, espnAbbrToSlug, getAllMappings } from './team-mapping';

// ── Response types (ESPN API is untyped, we define what we need) ──
interface EspnScoreboardResponse {
  events: EspnEvent[];
  leagues: Array<{ season: { year: number; type: number } }>;
}

interface EspnEvent {
  id: string;
  date: string;
  name: string;
  status: {
    type: { name: string; state: string; completed: boolean };
    period: number;
    displayClock: string;
  };
  competitions: Array<{
    venue: { fullName: string };
    broadcasts: Array<{ names: string[] }>;
    competitors: Array<{
      id: string;
      homeAway: 'home' | 'away';
      score: string;
      records: Array<{ summary: string }>;
      team: {
        id: string;
        abbreviation: string;
        displayName: string;
        logo: string;
        color: string;
        alternateColor: string;
      };
    }>;
    series?: { summary: string };
  }>;
}

interface EspnStandingsResponse {
  children: Array<{
    name: string;
    standings: {
      entries: Array<{
        team: { id: string; abbreviation: string; displayName: string; logos: Array<{ href: string }> };
        stats: Array<{ name: string; displayValue: string; value: number }>;
      }>;
    };
  }>;
}

interface EspnRosterResponse {
  athletes: Array<{
    id: string;
    fullName: string;
    jersey: string;
    position: { abbreviation: string };
    headshot?: { href: string };
    displayHeight: string;
    displayWeight: string;
    age: number;
    birthPlace?: { country: string };
  }>;
}

// ── Normalized types (what we return) ──
export interface NormalizedScore {
  externalId: string;
  date: string;
  startTime: string;
  status: 'scheduled' | 'live' | 'final';
  homeTeamId: string;
  homeTeamName: string;
  homeTeamAbbr: string;
  homeTeamLogo: string;
  homeScore: number | null;
  homeRecord: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamAbbr: string;
  awayTeamLogo: string;
  awayScore: number | null;
  awayRecord: string;
  quarter: string | null;
  clock: string | null;
  venue: string | null;
  broadcast: string | null;
  seriesInfo: string | null;
}

export interface NormalizedPlayer {
  externalId: string;
  name: string;
  jersey: string;
  position: string;
  headshot: string | null;
  height: string;
  weight: string;
  age: number;
  country: string;
}

export interface EnrichedPlayerDetail extends NormalizedPlayer {
  teamId: string;
  teamName: string;
  teamAbbr: string;
  teamLogo: string;
  draftInfo: string;
  experience: number;
}

export interface NormalizedStandingsEntry {
  teamId: string;
  teamName: string;
  teamAbbr: string;
  teamLogo: string;
  conference: string;
  wins: number;
  losses: number;
  pct: number;
  gamesBehind: string;
  streak: string;
  seed: number;
}

// ── Metric conversion helpers (imperial → metric for BR audience) ──
function feetInchesToMetric(ft: string): string {
  if (!ft || ft === '-') return ft;
  const match = ft.match(/(\d+)'(\d+)"?/);
  if (!match) return ft;
  const meters = parseInt(match[1]) * 0.3048 + parseInt(match[2]) * 0.0254;
  return meters.toFixed(2).replace('.', ',') + ' m';
}

function lbsToKg(lbs: string): string {
  if (!lbs || lbs === '-') return lbs;
  const num = parseFloat(lbs.replace(/[^\d.]/g, ''));
  if (isNaN(num)) return lbs;
  return Math.round(num * 0.453592) + ' kg';
}

function translateCountry(country: string): string {
  const map: Record<string, string> = {
    'USA': 'EUA', 'United States': 'EUA',
    'Canada': 'Canadá', 'France': 'França',
    'Germany': 'Alemanha', 'Spain': 'Espanha',
    'Australia': 'Austrália', 'Serbia': 'Sérvia',
    'Greece': 'Grécia', 'Slovenia': 'Eslovênia',
    'Cameroon': 'Camarões', 'Nigeria': 'Nigéria',
    'Japan': 'Japão', 'South Sudan': 'Sudão do Sul',
    'Dominican Republic': 'República Dominicana',
    'Bahamas': 'Bahamas', 'Jamaica': 'Jamaica',
  };
  return map[country] || country;
}

@Injectable()
export class EspnService {
  private readonly logger = new Logger(EspnService.name);
  private readonly baseUrl: string;
  private static readonly FETCH_TIMEOUT = 10_000; // 10 seconds

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get<string>('espn.baseUrl')!;
  }

  /** Fetch with timeout to prevent hanging requests */
  private async fetchWithTimeout(url: string, timeoutMs = EspnService.FETCH_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Scoreboard (today's games) ──
  async getScoreboard(dateStr?: string): Promise<NormalizedScore[]> {
    const params = dateStr ? `?dates=${dateStr}` : '';
    const url = `${this.baseUrl}/scoreboard${params}`;

    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) throw new Error(`ESPN scoreboard responded ${res.status}`);
      const data = (await res.json()) as EspnScoreboardResponse;

      return data.events.map((event) => this.normalizeEvent(event));
    } catch (error) {
      this.logger.error('Failed to fetch ESPN scoreboard', (error as Error).message);
      return [];
    }
  }

  // ── Single Event from Summary (works for any game, any date) ──
  async getNormalizedEvent(eventId: string): Promise<NormalizedScore | null> {
    const summary = await this.getEventSummary(eventId);
    if (!summary) return null;

    try {
      const header = summary.header as any;
      if (!header?.competitions?.[0]) return null;

      const comp = header.competitions[0];
      const competitors = comp.competitors as any[];
      if (!competitors || competitors.length < 2) return null;

      const home = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
      const away = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];

      const statusObj = comp.status;
      let status: 'scheduled' | 'live' | 'final' = 'scheduled';
      if (statusObj?.type?.state === 'in') status = 'live';
      else if (statusObj?.type?.completed) status = 'final';

      // Summary header uses team.logos[].href instead of team.logo
      const getTeamLogo = (team: any): string => {
        if (team.logo) return team.logo;
        if (team.logos?.[0]?.href) return team.logos[0].href;
        return `https://a.espncdn.com/i/teamlogos/nba/500/${(team.abbreviation || '').toLowerCase()}.png`;
      };

      // Score: summary uses displayScore or score as string
      const getScore = (competitor: any): number | null => {
        if (status === 'scheduled') return null;
        if (competitor.score != null) return parseInt(String(competitor.score), 10) || 0;
        if (competitor.displayScore) return parseInt(competitor.displayScore, 10) || 0;
        return null;
      };

      return {
        externalId: String(header.id || eventId),
        date: comp.date || header.gameDate || new Date().toISOString(),
        startTime: comp.date || header.gameDate || new Date().toISOString(),
        status,
        homeTeamId: espnIdToSlug(String(home.team?.id || home.id || '')),
        homeTeamName: home.team?.displayName || home.team?.name || '',
        homeTeamAbbr: home.team?.abbreviation || '',
        homeTeamLogo: getTeamLogo(home.team || {}),
        homeScore: getScore(home),
        homeRecord: (Array.isArray(home.record) ? home.record.find((r: any) => r.type === 'total')?.summary : home.record) || home.records?.[0]?.summary || '-',
        awayTeamId: espnIdToSlug(String(away.team?.id || away.id || '')),
        awayTeamName: away.team?.displayName || away.team?.name || '',
        awayTeamAbbr: away.team?.abbreviation || '',
        awayTeamLogo: getTeamLogo(away.team || {}),
        awayScore: getScore(away),
        awayRecord: (Array.isArray(away.record) ? away.record.find((r: any) => r.type === 'total')?.summary : away.record) || away.records?.[0]?.summary || '-',
        quarter: status === 'live' ? `Q${statusObj?.period || 0}` : null,
        clock: status === 'live' ? (statusObj?.displayClock || '') : null,
        venue: comp.venue?.fullName || null,
        broadcast: comp.broadcasts?.[0]?.names?.join(', ') || null,
        seriesInfo: comp.series?.summary || null,
      };
    } catch (error) {
      this.logger.error(`Failed to normalize event ${eventId}`, (error as Error).message);
      return null;
    }
  }

  // ── Standings ──
  async getStandings(): Promise<NormalizedStandingsEntry[]> {
    const url = `https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2026`;

    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) throw new Error(`ESPN standings responded ${res.status}`);
      const data = (await res.json()) as EspnStandingsResponse;

      const entries: NormalizedStandingsEntry[] = [];
      for (const conf of data.children) {
        const confName = conf.name.toLowerCase().includes('east') ? 'east' : 'west';
        const confEntries: NormalizedStandingsEntry[] = [];
        
        conf.standings.entries.forEach((entry, index) => {
          const getStat = (name: string) => {
            const stat = entry.stats.find((s) => s.name === name);
            return stat ? stat.value : 0;
          };
          const getStatDisplay = (name: string) => {
            const stat = entry.stats.find((s) => s.name === name);
            return stat ? stat.displayValue : '-';
          };

          confEntries.push({
            teamId: espnIdToSlug(entry.team.id),
            teamName: entry.team.displayName,
            teamAbbr: entry.team.abbreviation,
            teamLogo: entry.team.logos?.[0]?.href ?? '',
            conference: confName,
            wins: getStat('wins'),
            losses: getStat('losses'),
            pct: getStat('winPercent'),
            gamesBehind: getStatDisplay('gamesBehind'),
            streak: getStatDisplay('streak'),
            seed: index + 1,
          });
        });

        // Sort properly inside the current conference
        confEntries.sort((a, b) => {
          const pctA = Number(a.pct) || 0;
          const pctB = Number(b.pct) || 0;
          if (pctB !== pctA) return pctB - pctA;
          return (Number(b.wins) || 0) - (Number(a.wins) || 0);
        });

        // Recalculate seeds after sorting
        confEntries.forEach((e, idx) => {
          e.seed = idx + 1;
        });

        entries.push(...confEntries);
      }

      return entries;
    } catch (error) {
      this.logger.error('Failed to fetch ESPN standings', (error as Error).message);
      return [];
    }
  }

  // ── Team Roster ──
  async getTeamRoster(teamExternalId: string): Promise<NormalizedPlayer[]> {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamExternalId}/roster`;

    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) throw new Error(`ESPN roster responded ${res.status}`);
      const data = (await res.json()) as EspnRosterResponse;

      return (data.athletes || []).map((a) => ({
        externalId: a.id,
        name: a.fullName,
        jersey: a.jersey || '-',
        position: a.position?.abbreviation || '-',
        headshot: a.headshot?.href ?? null,
        height: feetInchesToMetric(a.displayHeight || '-'),
        weight: lbsToKg(a.displayWeight || '-'),
        age: a.age || 0,
        country: translateCountry(a.birthPlace?.country || 'USA'),
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch roster for team ${teamExternalId}`, (error as Error).message);
      return [];
    }
  }

  // ── Player Details ──
  async getPlayerDetails(playerId: string): Promise<EnrichedPlayerDetail | null> {
    // If playerId is not numeric, it's likely a slug. Try searching for it first.
    if (!/^\d+$/.test(playerId)) {
      const normalizedQuery = decodeURIComponent(playerId).replace(/[-_]+/g, ' ').trim();
      const searchedPlayer = await this.searchPlayer(normalizedQuery);
      if (searchedPlayer) return searchedPlayer;
      return null;
    }

    const url = `http://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${playerId}`;

    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) return null;
      const a = (await res.json()) as Record<string, unknown>;

      // Core API returns a team ref object, extract team external ID from the end of the ref URL
      let espnTeamId = 'free-agent';
      const teamRef = a.team as { $ref?: string } | undefined;
      if (teamRef?.$ref) {
        const match = teamRef.$ref.match(/teams\/(\d+)/);
        if (match) espnTeamId = match[1];
      }

      // Enrich with team info from our mapping
      const teamSlug = espnIdToSlug(espnTeamId);
      const teamMapping = getAllMappings().find((t) => t.slug === teamSlug);

      const pos = a.position as { abbreviation?: string } | undefined;
      const headshot = a.headshot as { href?: string } | undefined;
      const birthPlace = a.birthPlace as { country?: string } | undefined;
      const draft = a.draft as { displayText?: string } | undefined;
      const experience = a.experience as { years?: number } | undefined;

      return {
        externalId: String(a.id),
        name: (a.fullName || a.displayName) as string,
        jersey: (a.jersey as string) || '-',
        position: pos?.abbreviation || '-',
        headshot: headshot?.href ?? null,
        height: feetInchesToMetric((a.displayHeight as string) || '-'),
        weight: lbsToKg((a.displayWeight as string) || '-'),
        age: (a.age as number) || 0,
        country: translateCountry(birthPlace?.country || 'USA'),
        teamId: teamSlug,
        teamName: teamMapping?.name || 'Free Agent',
        teamAbbr: teamMapping?.espnAbbr || '-',
        teamLogo: `https://a.espncdn.com/i/teamlogos/nba/500/${teamSlug}.png`,
        draftInfo: draft?.displayText || '-',
        experience: experience?.years || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch player ${playerId}`, (error as Error).message);
      return null;
    }
  }

  // ── News ──
  async getNews(): Promise<Record<string, unknown>[]> {
    // Fetch specifically Portuguese localized news with a higher limit to filter downstream
    const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=30&lang=pt&region=br';
    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) throw new Error(`ESPN news responded ${res.status}`);
      const data = (await res.json()) as any;
      if (!data.articles) return [];

      let rawArticles = data.articles;
      
      // Strict rule: user explicitly wants only articles that possess an image
      rawArticles = rawArticles.filter((a: any) => a.images && a.images.length > 0 && a.images[0].url);
      
      // Sliced strictly to 10 items
      rawArticles = rawArticles.slice(0, 10);

      return rawArticles.map((article: any) => {
        let categoryAssigned = 'news';
        if (article.categories && article.categories.length > 0) {
           const desc = article.categories[0].description?.toLowerCase();
           if (desc === 'análise') categoryAssigned = 'analysis';
           if (desc === 'feature' || desc === 'destaque') categoryAssigned = 'feature';
        }
        if (article.type === 'Media') categoryAssigned = 'highlight'; // Optional styling feature

        return {
          id: article.id?.toString() || Math.random().toString(),
          title: article.headline,
          summary: article.description || article.title,
          content: article.story || article.description,
          coverImage: article.images[0].url,
          publishedAt: article.published,
          author: { id: 'espn', name: article.byline || 'ESPN Brasil' },
          slug: String(article.id),
          tags: article.categories ? article.categories.map((c: any) => c.description).filter(Boolean) : ['NBA'],
          link: article.links?.web?.href,
          category: categoryAssigned,
          readTimeMinutes: Math.max(1, Math.ceil((article.story || article.description || article.headline || '').length / 1000)),
          source: 'espn-ingested',
          status: 'published',
          relatedTeams: [],
          relatedPlayers: [],
        };
      });
    } catch (error) {
      this.logger.error('Failed to fetch ESPN news', (error as Error).message);
      return [];
    }
  }

  // ── Search Player ──
  async searchPlayer(query: string): Promise<EnrichedPlayerDetail | null> {
    const performSearch = async (q: string) => {
      try {
        const url = `http://site.api.espn.com/apis/common/v3/search?region=us&lang=en&query=${encodeURIComponent(q)}&limit=25&type=player`;
        const res = await this.fetchWithTimeout(url);
        if (!res.ok) return null;
        const data = (await res.json()) as { items?: any[] };
        
        // Match Priority: Basketball (s:40)
        return (data.items || []).find((a: any) => a.uid?.includes('s:40')) || null;
      } catch {
        return null;
      }
    };

    try {
      // First attempt
      let targetAthlete = await performSearch(query);
      
      // Fallback attempt: if no b-baller found, try appending " nba"
      if (!targetAthlete && !query.toLowerCase().includes('nba')) {
        targetAthlete = await performSearch(`${query} nba`);
      }

      if (!targetAthlete) return null;

      const match = targetAthlete.uid?.match(/~a:(\d+)/);
      if (!match) return null;

      return this.getPlayerDetails(match[1]);
    } catch (error) {
      this.logger.error(`Search failed for ${query}`, (error as Error).message);
      return null;
    }
  }

  // ── Single News Article ──
  async getNewsArticleBySlug(slug: string): Promise<Record<string, unknown> | null> {
    // Fetch full article list (unfiltered) and find by ID
    const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=50&lang=pt&region=br';
    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) throw new Error(`ESPN news responded ${res.status}`);
      const data = (await res.json()) as { articles?: Array<Record<string, unknown>> };
      if (!data.articles) return null;

      const article = data.articles.find((a) => String(a.id) === slug);
      if (!article) return null;

      const images = article.images as Array<{ url: string }> | undefined;
      const categories = article.categories as Array<{ description?: string }> | undefined;
      const links = article.links as { web?: { href?: string } } | undefined;

      let categoryAssigned = 'news';
      if (categories && categories.length > 0) {
        const desc = categories[0].description?.toLowerCase();
        if (desc === 'análise') categoryAssigned = 'analysis';
        if (desc === 'feature' || desc === 'destaque') categoryAssigned = 'feature';
      }
      if (article.type === 'Media') categoryAssigned = 'highlight';

      return {
        id: String(article.id),
        title: article.headline,
        summary: article.description || article.title,
        content: article.story || article.description,
        coverImage: images?.[0]?.url ?? null,
        publishedAt: article.published,
        author: { id: 'espn', name: (article.byline as string) || 'ESPN Brasil' },
        slug: String(article.id),
        tags: categories ? categories.map((c) => c.description).filter(Boolean) : ['NBA'],
        link: links?.web?.href,
        category: categoryAssigned,
        readTimeMinutes: Math.max(1, Math.ceil(((article.story || article.description || article.headline || '') as string).length / 1000)),
        source: 'espn-ingested',
        status: 'published',
        relatedTeams: [],
        relatedPlayers: [],
      };
    } catch (error) {
      this.logger.error(`Failed to fetch article ${slug}`, (error as Error).message);
      return null;
    }
  }

  // ── Internal: Normalize ESPN Event ──
  private normalizeEvent(event: EspnEvent): NormalizedScore {
    const comp = event.competitions[0];
    const home = comp.competitors.find((c) => c.homeAway === 'home')!;
    const away = comp.competitors.find((c) => c.homeAway === 'away')!;

    const statusObj = event.status || (comp as any).status;
    const dateStr = event.date || (comp as any).date;

    let status: 'scheduled' | 'live' | 'final' = 'scheduled';
    if (statusObj?.type?.state === 'in') status = 'live';
    else if (statusObj?.type?.completed) status = 'final';

    return {
      externalId: event.id,
      date: dateStr,
      startTime: dateStr,
      status,
      homeTeamId: espnIdToSlug(home.team.id),
      homeTeamName: home.team.displayName || (home.team as any).name || '',
      homeTeamAbbr: home.team.abbreviation,
      homeTeamLogo: home.team.logo,
      homeScore: status !== 'scheduled' ? parseInt(home.score || '0', 10) : null,
      homeRecord: home.records?.[0]?.summary || '-',
      awayTeamId: espnIdToSlug(away.team.id),
      awayTeamName: away.team.displayName || (away.team as any).name || '',
      awayTeamAbbr: away.team.abbreviation,
      awayTeamLogo: away.team.logo,
      awayScore: status !== 'scheduled' ? parseInt(away.score || '0', 10) : null,
      awayRecord: away.records?.[0]?.summary || '-',
      quarter: status === 'live' ? `Q${statusObj.period}` : null,
      clock: status === 'live' ? statusObj.displayClock : null,
      venue: comp.venue?.fullName ?? null,
      broadcast: comp.broadcasts?.[0]?.names?.join(', ') ?? null,
      seriesInfo: comp.series?.summary ?? null,
    };
  }

  // ── ESPN Core API: Event Summary ──
  async getEventSummary(eventId: string): Promise<Record<string, unknown> | null> {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`;
    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) return null;
      return (await res.json()) as Record<string, unknown>;
    } catch (error) {
      this.logger.error(`Failed to fetch event summary ${eventId}`, (error as Error).message);
      return null;
    }
  }

  // ── ESPN Core API: Play-by-Play ──
  async getPlayByPlay(eventId: string): Promise<Record<string, unknown> | null> {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`;
    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) return null;
      const data = (await res.json()) as Record<string, unknown>;
      // The summary endpoint includes plays in the response
      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch plays for ${eventId}`, (error as Error).message);
      return null;
    }
  }

  // ── Find a single game by eventId from scoreboard ──
  async getGameFromScoreboard(eventId: string, dateStr?: string): Promise<NormalizedScore | null> {
    const games = await this.getScoreboard(dateStr);
    return games.find((g) => g.externalId === eventId) ?? null;
  }
}

