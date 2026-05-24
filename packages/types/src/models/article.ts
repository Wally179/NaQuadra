// ============================================================
// Na Quadra — Shared Types: Article / News
// ============================================================

export type ArticleCategory = 'news' | 'analysis' | 'feature' | 'explainer' | 'highlight';
export type ArticleSource = 'editorial' | 'espn-ingested';
export type ArticleStatus = 'published' | 'draft' | 'archived';

export interface ArticleAuthor {
  id: string;
  name: string;
  avatar?: string;
}

export interface NormalizedArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  content: string;
  coverImage: string | null;
  author: ArticleAuthor;
  category: ArticleCategory;
  tags: string[];
  relatedTeams: string[];
  relatedPlayers: string[];
  source: ArticleSource;
  sourceUrl?: string;
  link?: string;
  status: ArticleStatus;
  publishedAt: string;
  readTimeMinutes: number;
  glossaryTerms?: string[];
}
