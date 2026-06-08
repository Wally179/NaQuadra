// ============================================================
// Na Quadra — News Section (Async Server Component)
// Fetches news data independently and streams via Suspense.
// ============================================================

import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import { fetchNews } from '@/lib/api';
import { MOCK_ARTICLES } from '@/data/mock-articles';
import Link from 'next/link';
import styles from '../page.module.css';

export async function NewsSection() {
  let articles = await fetchNews({
    revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600,
    tags: ['news'],
  });

  if (!articles || articles.length === 0) {
    articles = MOCK_ARTICLES;
  }

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1, 5);

  return (
    <section className={styles.newsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Últimas Notícias</h2>
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
