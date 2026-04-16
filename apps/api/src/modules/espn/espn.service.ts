// ============================================================
// Na Quadra — ESPN Service
// Real integration with ESPN public APIs
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { espnIdToSlug, espnAbbrToSlug } from './team-mapping';

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

@Injectable()
export class EspnService {
  private readonly logger = new Logger(EspnService.name);
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get<string>('espn.baseUrl')!;
  }

  // ── Scoreboard (today's games) ──
  async getScoreboard(dateStr?: string): Promise<NormalizedScore[]> {
    const params = dateStr ? `?dates=${dateStr}` : '';
    const url = `${this.baseUrl}/scoreboard${params}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`ESPN scoreboard responded ${res.status}`);
      const data = (await res.json()) as EspnScoreboardResponse;

      return data.events.map((event) => this.normalizeEvent(event));
    } catch (error) {
      this.logger.error('Failed to fetch ESPN scoreboard', (error as Error).message);
      return [];
    }
  }

  // ── Standings ──
  async getStandings(): Promise<NormalizedStandingsEntry[]> {
    const url = `https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2026`;

    try {
      const res = await fetch(url);
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
      const res = await fetch(url);
      if (!res.ok) throw new Error(`ESPN roster responded ${res.status}`);
      const data = (await res.json()) as EspnRosterResponse;

      return (data.athletes || []).map((a) => ({
        externalId: a.id,
        name: a.fullName,
        jersey: a.jersey || '-',
        position: a.position?.abbreviation || '-',
        headshot: a.headshot?.href ?? null,
        height: a.displayHeight || '-',
        weight: a.displayWeight || '-',
        age: a.age || 0,
        country: a.birthPlace?.country || 'USA',
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch roster for team ${teamExternalId}`, (error as Error).message);
      return [];
    }
  }

  // ── Player Details ──
  async getPlayerDetails(playerId: string): Promise<NormalizedPlayer & { teamId: string; draftInfo: string; experience: number } | null> {
    // If playerId is not numeric, it's likely a slug. Try searching for it first.
    if (!/^\d+$/.test(playerId)) {
      const searchedPlayer = await this.searchPlayer(playerId);
      if (searchedPlayer) return searchedPlayer;
      return null;
    }

    const url = `http://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${playerId}`;

    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const a = (await res.json()) as Record<string, any>;

      // Core API returns a team ref object, extract team external ID from the end of the ref URL
      let teamId = 'free-agent';
      if (a.team && a.team.$ref) {
        const match = a.team.$ref.match(/teams\/(\d+)/);
        if (match) teamId = match[1];
      }

      return {
        externalId: a.id,
        name: a.fullName || a.displayName,
        jersey: a.jersey || '-',
        position: a.position?.abbreviation || '-',
        headshot: a.headshot?.href ?? null,
        height: a.displayHeight || '-',
        weight: a.displayWeight || '-',
        age: a.age || 0,
        country: a.birthPlace?.country || 'USA',
        teamId, // ESPN format (numeric)
        draftInfo: a.draft?.displayText || '-',
        experience: a.experience?.years || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch player ${playerId}`, (error as Error).message);
      return null;
    }
  }

  // ── News ──
  async getNews(): Promise<any[]> {
    // Fetch specifically Portuguese localized news with a higher limit to filter downstream
    const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=30&lang=pt&region=br';
    try {
      const res = await fetch(url);
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
          slug: article.nowId || article.id?.toString(),
          tags: article.categories ? article.categories.map((c: any) => c.description).filter(Boolean) : ['NBA'],
          link: article.links?.web?.href,
          category: categoryAssigned,
          readTimeMinutes: Math.floor(Math.random() * 5) + 2, // Dummy read time
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
  async searchPlayer(query: string): Promise<NormalizedPlayer & { teamId: string; draftInfo: string; experience: number } | null> {
    const url = `http://site.api.espn.com/apis/common/v3/search?region=us&lang=en&query=${encodeURIComponent(query)}&limit=5&type=player`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      
      const athletes = data.items?.[0]?.athletes || [];
      if (athletes.length === 0) return null;

      // Extract ESPN athlete ID from uid (e.g. "s:40~l:46~a:1966")
      const firstMatch = athletes[0];
      const match = firstMatch.uid?.match(/~a:(\d+)/);
      if (!match) return null;

      const playerId = match[1];
      // Reuse the existing detail fetcher
      return this.getPlayerDetails(playerId);
    } catch (error) {
      this.logger.error(`Search failed for ${query}`, (error as Error).message);
      return null;
    }
  }

  // ── Single News Article ──
  async getNewsArticleBySlug(slug: string): Promise<any | null> {
    // For simplicity, we filter over the recent news. In a production caching layer, 
    // we would pull from DB or fetch a specific endpoint like now.core.api.espn.com
    const news = await this.getNews();
    const article = news.find((n) => n.slug === slug);
    return article || null;
  }

  // ── Internal: Normalize ESPN Event ──
  private normalizeEvent(event: EspnEvent): NormalizedScore {
    const comp = event.competitions[0];
    const home = comp.competitors.find((c) => c.homeAway === 'home')!;
    const away = comp.competitors.find((c) => c.homeAway === 'away')!;

    let status: 'scheduled' | 'live' | 'final' = 'scheduled';
    if (event.status.type.state === 'in') status = 'live';
    else if (event.status.type.completed) status = 'final';

    return {
      externalId: event.id,
      date: event.date,
      startTime: event.date,
      status,
      homeTeamId: espnIdToSlug(home.team.id),
      homeTeamName: home.team.displayName,
      homeTeamAbbr: home.team.abbreviation,
      homeTeamLogo: home.team.logo,
      homeScore: status !== 'scheduled' ? parseInt(home.score, 10) : null,
      homeRecord: home.records?.[0]?.summary || '-',
      awayTeamId: espnIdToSlug(away.team.id),
      awayTeamName: away.team.displayName,
      awayTeamAbbr: away.team.abbreviation,
      awayTeamLogo: away.team.logo,
      awayScore: status !== 'scheduled' ? parseInt(away.score, 10) : null,
      awayRecord: away.records?.[0]?.summary || '-',
      quarter: status === 'live' ? `Q${event.status.period}` : null,
      clock: status === 'live' ? event.status.displayClock : null,
      venue: comp.venue?.fullName ?? null,
      broadcast: comp.broadcasts?.[0]?.names?.join(', ') ?? null,
      seriesInfo: comp.series?.summary ?? null,
    };
  }
}
