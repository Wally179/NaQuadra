// ============================================================
// Na Quadra — News Section (Async Server Component)
// Fetches news data independently and streams via Suspense.
// ============================================================

import { fetchNews } from '@/lib/api';
import { MOCK_ARTICLES } from '@/data/mock-articles';
import { NewsSectionClient } from './NewsSectionClient';

export async function NewsSection() {
  let articles = await fetchNews({
    revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600,
    tags: ['news'],
  });

  if (!articles || articles.length === 0) {
    articles = MOCK_ARTICLES;
  }

  return <NewsSectionClient initialArticles={articles} />;
}
