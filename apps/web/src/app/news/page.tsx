import { fetchNews } from '@/lib/api';
import { MOCK_ARTICLES } from '@/data/mock-articles';
import { NewsFeed } from './NewsFeed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notícias | Na Quadra',
  description: 'Últimas notícias, análises e destaques da NBA.',
};

export default async function NewsPage() {
  let articles;
  try {
    articles = await fetchNews({ revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600, tags: ['news'] });
  } catch (error) {
    console.error('Failed to fetch news, falling back to mock.');
  }

  // Fallback to mock data if API is down or returns empty
  if (!articles || articles.length === 0) {
    articles = MOCK_ARTICLES as any;
  }

  return <NewsFeed initialArticles={articles} />;
}
