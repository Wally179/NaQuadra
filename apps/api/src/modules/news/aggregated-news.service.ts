import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EspnService } from '../espn/espn.service';
import type { NormalizedArticle } from '@naquadra/types';

@Injectable()
export class AggregatedNewsService {
  private readonly logger = new Logger(AggregatedNewsService.name);
  
  private readonly NEWS_API_KEY: string;
  private readonly GNEWS_API_KEY: string;
  
  private cachedArticles: NormalizedArticle[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  constructor(
    private readonly espnService: EspnService,
    private readonly config: ConfigService,
  ) {
    this.NEWS_API_KEY = this.config.get<string>('NEWS_API_KEY', '');
    this.GNEWS_API_KEY = this.config.get<string>('GNEWS_API_KEY', '');
  }

  async getNews(): Promise<NormalizedArticle[]> {
    const now = Date.now();
    if (this.cachedArticles.length > 0 && (now - this.lastFetch) < this.CACHE_TTL_MS) {
      return this.cachedArticles;
    }

    const [espnResult, newsApiResult, gnewsResult] = await Promise.allSettled([
      this.espnService.getNews() as unknown as Promise<NormalizedArticle[]>,
      this.fetchNewsApi(),
      this.fetchGNews(),
    ]);

    let articles: NormalizedArticle[] = [];

    if (espnResult.status === 'fulfilled' && espnResult.value) {
      articles = [...articles, ...espnResult.value];
    } else if (espnResult.status === 'rejected') {
      this.logger.error(`ESPN fetch failed: ${espnResult.reason}`);
    }

    const keywords = ['nba', 'basquete', 'basketball', 'lakers', 'celtics', 'warriors', 'lebron', 'curry', 'jordan', 'bulls', 'knicks', 'thunder', 'nuggets', 'heat', 'spurs', 'mavericks', 'timberwolves', 'suns', 'clippers', 'sixers', 'bucks', 'cavaliers', 'pacers'];
    const isBasketballRelated = (text: string) => {
      if (!text) return false;
      const lower = text.toLowerCase();
      return keywords.some(k => lower.includes(k));
    };

    if (newsApiResult.status === 'fulfilled' && newsApiResult.value) {
      console.log('NewsAPI articles found:', newsApiResult.value.length);
      articles = [...articles, ...newsApiResult.value];
    } else if (newsApiResult.status === 'rejected') {
      this.logger.error(`NewsAPI fetch failed: ${newsApiResult.reason}`);
    }

    if (gnewsResult.status === 'fulfilled' && gnewsResult.value) {
      console.log('GNews articles found:', gnewsResult.value.length);
      articles = [...articles, ...gnewsResult.value];
    } else if (gnewsResult.status === 'rejected') {
      this.logger.error(`GNews fetch failed: ${gnewsResult.reason}`);
    }

    // Sort by publishedAt (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Deduplicate by title or link
    const seen = new Set<string>();
    const uniqueArticles: NormalizedArticle[] = [];
    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (!seen.has(normalizedTitle) && (!article.link || !seen.has(article.link))) {
        seen.add(normalizedTitle);
        if (article.link) seen.add(article.link);
        // strict filter
        if (article.source !== 'editorial' && article.author.id !== 'espn') {
           if (isBasketballRelated(article.title) || isBasketballRelated(article.summary || '') || isBasketballRelated(article.content)) {
               uniqueArticles.push(article);
           }
        } else {
           uniqueArticles.push(article); // Keep all ESPN/editorial
        }
      }
    }

    // Merge with existing cache to keep old articles available for detail views
    const mergedArticles = [...uniqueArticles];
    for (const cached of this.cachedArticles) {
      if (!mergedArticles.find(a => a.slug === cached.slug)) {
        mergedArticles.push(cached);
      }
    }
    
    // Sort and limit cache to 200 items to prevent memory leaks
    mergedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    this.cachedArticles = mergedArticles.slice(0, 200);
    this.lastFetch = now;

    return uniqueArticles;
  }

  async getNewsArticleBySlug(slug: string): Promise<NormalizedArticle | null> {
    // First, check cache
    const cached = this.cachedArticles.find(a => a.slug === slug);
    if (cached) return cached;

    // If cache missed, try repopulating the cache if it's empty (e.g. server restart)
    if (this.cachedArticles.length === 0) {
      await this.getNews();
      const cachedAfterFetch = this.cachedArticles.find(a => a.slug === slug);
      if (cachedAfterFetch) return cachedAfterFetch;
    }

    // If it's an ESPN article (usually numerical ID or specific slug), try ESPN
    // If it's from GNews or NewsAPI, we might not be able to fetch it individually easily
    // But since it wasn't in cache, we'll try ESPN just in case.
    try {
      const espnArticle = await this.espnService.getNewsArticleBySlug(slug);
      return espnArticle as NormalizedArticle | null;
    } catch {
      return null;
    }
  }

  private async fetchNewsApi(): Promise<NormalizedArticle[]> {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=br&category=sports&q=nba&apiKey=${this.NEWS_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NewsAPI returned ${response.status}`);
      }
      const data = (await response.json()) as any;
      
      console.log('RAW NEWSAPI RESPONSE:', JSON.stringify(data).substring(0, 500) + '...');
      
      if (!data.articles || !Array.isArray(data.articles)) return [];

      return data.articles
        .filter((a: any) => a.urlToImage && a.title && a.description) // Must have image and text
        .map((a: any) => this.mapNewsApiArticleToArticle(a));
    } catch (error) {
      this.logger.error('Failed to fetch from NewsAPI', (error as Error).message);
      return [];
    }
  }

  private async fetchGNews(): Promise<NormalizedArticle[]> {
    try {
      // GNews max limit for free tier is 10
      const url = `https://gnews.io/api/v4/top-headlines?category=sports&q=nba OR basquete&lang=pt&country=br&apikey=${this.GNEWS_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`GNews returned ${response.status}`);
      }
      const data = (await response.json()) as any;
      
      console.log('RAW GNEWS RESPONSE:', JSON.stringify(data).substring(0, 500) + '...');
      
      if (!data.articles || !Array.isArray(data.articles)) return [];

      return data.articles
        .filter((a: any) => a.image && a.title && a.description) // Must have image and text
        .map((a: any) => this.mapGNewsArticleToArticle(a));
    } catch (error) {
      this.logger.error('Failed to fetch from GNews', (error as Error).message);
      return [];
    }
  }

  private mapNewsApiArticleToArticle(raw: any): NormalizedArticle {
    // Generate a safe, deterministic slug from the URL or title
    const fallbackId = raw.title ? Buffer.from(raw.title).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 30) : Math.random().toString(36).substring(7);
    const slug = raw.url ? Buffer.from(raw.url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 30) : fallbackId;
    
    return {
      id: slug,
      slug: slug,
      title: raw.title,
      summary: raw.description,
      content: raw.content || raw.description || raw.title, // User asked to use summary as content if missing
      coverImage: raw.urlToImage,
      publishedAt: raw.publishedAt,
      author: {
        id: 'newsapi',
        name: raw.source?.name || 'NewsAPI',
      },
      tags: ['Basquete'],
      link: raw.url,
      sourceUrl: raw.url,
      category: 'news',
      readTimeMinutes: Math.max(1, Math.ceil((raw.content || raw.description || '').length / 1000)),
      source: 'espn-ingested', // Forced by type, we use this to mean "external"
      status: 'published',
      relatedTeams: [],
      relatedPlayers: [],
    };
  }

  private mapGNewsArticleToArticle(raw: any): NormalizedArticle {
    // Generate a safe, deterministic slug from the URL or title
    const fallbackId = raw.title ? Buffer.from(raw.title).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 30) : Math.random().toString(36).substring(7);
    const slug = raw.url ? Buffer.from(raw.url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 30) : fallbackId;

    return {
      id: slug,
      slug: slug,
      title: raw.title,
      summary: raw.description,
      content: raw.content || raw.description || raw.title,
      coverImage: raw.image,
      publishedAt: raw.publishedAt,
      author: {
        id: 'gnews',
        name: raw.source?.name || 'GNews',
      },
      tags: ['Basquete'],
      link: raw.url,
      sourceUrl: raw.url,
      category: 'news',
      readTimeMinutes: Math.max(1, Math.ceil((raw.content || raw.description || '').length / 1000)),
      source: 'espn-ingested',
      status: 'published',
      relatedTeams: [],
      relatedPlayers: [],
    };
  }
}
