'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authFetch } from '@/lib/api-auth';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import { NewsSectionSkeleton } from './NewsSectionSkeleton';
import Link from 'next/link';
import styles from '../page.module.css';
import type { NormalizedArticle } from '@naquadra/types';

interface NewsSectionProps {
  initialArticles: NormalizedArticle[];
}

export function NewsSectionClient({ initialArticles }: NewsSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [articles, setArticles] = useState<NormalizedArticle[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPersonalizedNews() {
      if (!isAuthenticated) {
        setArticles(initialArticles);
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await authFetch<{ data: NormalizedArticle[] }>('/news/personalized');
        if (res.data && res.data.length > 0) {
          setArticles(res.data);
        }
      } catch (error) {
        console.error('Failed to load personalized news', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPersonalizedNews();
  }, [isAuthenticated, initialArticles]);

  if (isLoading) {
    return <NewsSectionSkeleton />;
  }

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1, 5);

  return (
    <section className={styles.newsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {isAuthenticated && user?.favoriteTeamId ? 'Notícias Para Você' : 'Últimas Notícias'}
        </h2>
        <Link href="/news" className={styles.sectionLink}>
          Ver todas →
        </Link>
      </div>

      <div className={styles.articlesGrid}>
        {featuredArticle && (
          <ArticleCard article={featuredArticle} featured />
        )}
        {restArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
