'use client';

import { useState, useMemo } from 'react';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import type { Article } from '@/lib/api';
import styles from './page.module.css';

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'NBA', label: 'Notícias' },
];

interface NewsFeedProps {
  initialArticles: Article[];
}

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return initialArticles;
    return initialArticles.filter((a) => a.tags?.includes(activeTab));
  }, [activeTab, initialArticles]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Notícias</h1>
      <p className={styles.subtitle}>Últimas notícias, análises e destaques da NBA</p>

      {/* Category tabs */}
      <div className={styles.tabs} role="tablist">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className={styles.grid}>
        {filtered.map((article) => (
          <ArticleCard key={article.id} article={article as any} />
        ))}
      </div>
    </div>
  );
}
