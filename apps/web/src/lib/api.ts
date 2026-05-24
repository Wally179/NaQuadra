// ============================================================
// Na Quadra — API Client
// Central API client for fetching data from the backend.
// Falls back to mock data when the API is unavailable.
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  content: string;
  coverImage: string | null;
  author: { id: string; name: string; avatar?: string };
  category: 'news' | 'analysis' | 'feature' | 'explainer' | 'highlight';
  tags: string[];
  relatedTeams: string[];
  relatedPlayers: string[];
  source: 'editorial' | 'espn-ingested';
  sourceUrl?: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt: string;
  readTimeMinutes: number;
  link?: string;
  glossaryTerms?: string[];
}

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    next: {
      revalidate: opts.revalidate ?? 60, // Default: revalidate every 60s
      tags: opts.tags,
    },
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${url}`);
  }

  return res.json() as Promise<T>;
}

// ── Response wrappers ──
interface ApiListResponse<T> {
  data: T[];
  meta?: { total: number };
}

// ── Games / Scoreboard ──
export interface ScoreboardGame {
  externalId: string;
  date: string;
  startTime: string;
  status: string;
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
  venue: string;
  broadcast: string | null;
  seriesInfo: string | null;
}

export async function fetchScoreboard(): Promise<ScoreboardGame[]> {
  try {
    const res = await apiFetch<ApiListResponse<ScoreboardGame>>('/api/v1/games/scoreboard', {
      revalidate: 30, // Scoreboard refreshes every 30s
      tags: ['scoreboard'],
    });
    return res.data;
  } catch (error) {
    console.warn('[API] Scoreboard fetch failed, using empty:', error);
    return [];
  }
}

// ── Standings ──
export interface StandingsTeam {
  teamId: string;
  teamName: string;
  teamAbbr: string;
  teamLogo: string;
  conference: 'east' | 'west';
  wins: number;
  losses: number;
  pct: number;
  gamesBehind: string;
  streak: string;
  seed: number;
}

export async function fetchStandings(conference?: 'east' | 'west'): Promise<StandingsTeam[]> {
  try {
    // In browser (client components), use the Next.js proxy to avoid CORS
    const isClient = typeof window !== 'undefined';
    const basePath = isClient ? '/api/standings' : `${API_BASE}/api/v1/standings`;
    const query = conference ? `?conference=${conference}` : '';

    const res = await fetch(`${basePath}${query}`, {
      ...(isClient ? {} : { next: { revalidate: 300, tags: ['standings'] } }),
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.warn('[API] Standings fetch failed:', error);
    return [];
  }
}

// ── Players (Roster) ──
export interface RosterPlayer {
  externalId: string;
  name: string;
  jersey: string;
  position: string;
  headshot: string;
  height: string;
  weight: string;
  age: number;
  country: string;
}

export async function fetchTeamRoster(teamId: string): Promise<RosterPlayer[]> {
  try {
    const res = await apiFetch<{ data: RosterPlayer[] }>(`/api/v1/players/team/${teamId}`, {
      revalidate: 3600, // Roster changes rarely — 1 hour
      tags: ['roster', `roster-${teamId}`],
    });
    return res.data;
  } catch (error) {
    console.warn(`[API] Roster fetch failed for team ${teamId}:`, error);
    return [];
  }
}

// ── Player Details ──
export interface PlayerDetail {
  externalId: string;
  name: string;
  jersey: string;
  position: string;
  headshot: string;
  height: string;
  weight: string;
  age: number;
  country: string;
  dateOfBirth?: string | null;
  birthPlace?: string | null;
  college?: string | null;
  draftInfo: string | null;
  experience: number | null;
  teamId: string;
  teamName: string;
  teamAbbr: string;
  teamLogo: string;
}

export async function fetchPlayerDetail(playerId: string, options?: FetchOptions) {
  try {
    const res = await apiFetch<{ data: PlayerDetail }>(`/api/v1/players/${playerId}`, options);
    if (!res) return null;
    return res.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes('API error 404')) {
      console.error(`Failed to fetch player detail ${playerId}:`, err);
    }
    return null;
  }
}

export async function fetchNews(options?: FetchOptions): Promise<Article[]> {
  try {
    const res = await apiFetch<{ data: Article[] }>('/api/v1/news', options);
    if (!res || !res.data) return [];
    return res.data;
  } catch (err) {
    console.error('Failed to fetch news:', err);
    return [];
  }
}

export async function fetchNewsArticle(slug: string, options?: FetchOptions): Promise<Article | null> {
  try {
    // Use no-store to ensure each article slug gets a fresh fetch
    // (Next.js data cache can incorrectly serve stale results across dynamic routes)
    const url = `${API_BASE}/api/v1/news/${slug}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: Article };
    if (!json || !json.data) return null;
    return json.data;
  } catch (err) {
    console.error(`Failed to fetch news article ${slug}:`, err);
    return null;
  }
}

export async function fetchSearchPlayer(query: string, options?: FetchOptions): Promise<PlayerDetail | null> {
  try {
    const res = await apiFetch<{ data: PlayerDetail }>(`/api/v1/players/search?q=${encodeURIComponent(query)}`, options);
    if (!res || !res.data) return null;
    return res.data;
  } catch (error) {
    console.error(`Search failed for ${query}:`, error);
    return null;
  }
}

// ── Health Check ──
export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiFetch('/api/v1/health', { revalidate: false });
    return true;
  } catch {
    return false;
  }
}
