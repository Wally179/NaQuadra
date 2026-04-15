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
        conf.standings.entries.forEach((entry, index) => {
          const getStat = (name: string) => {
            const stat = entry.stats.find((s) => s.name === name);
            return stat ? stat.value : 0;
          };
          const getStatDisplay = (name: string) => {
            const stat = entry.stats.find((s) => s.name === name);
            return stat ? stat.displayValue : '-';
          };

          entries.push({
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
      }

      // Add a descending sort by PCT to fix ESPN API out-of-order arrays
      entries.sort((a, b) => {
        const pctA = Number(a.pct) || 0;
        const pctB = Number(b.pct) || 0;
        if (pctB !== pctA) return pctB - pctA;
        return (Number(b.wins) || 0) - (Number(a.wins) || 0);
      });

      // Recalculate seeds after sorting
      entries.forEach((e, idx) => {
        e.seed = idx + 1;
      });

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
    const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`ESPN news responded ${res.status}`);
      const data = (await res.json()) as any;
      if (!data.articles) return [];

      return data.articles.map((article: any) => ({
        id: article.id?.toString() || Math.random().toString(),
        title: article.headline,
        summary: article.description,
        content: article.description,
        imageUrl: article.images?.[0]?.url || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80',
        publishedAt: article.published,
        author: article.byline || 'ESPN',
        slug: article.nowId || article.id?.toString(),
        tags: ['NBA'],
        link: article.links?.web?.href,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch ESPN news', (error as Error).message);
      return [];
    }
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
