'use client';

import type { NormalizedArticle } from '@naquadra/types';
import { formatRelativeTime } from '@/lib/formatters';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: NormalizedArticle;
  featured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  news: 'Notícia',
  analysis: 'Análise',
  feature: 'Destaque',
  explainer: 'Explicação',
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className={styles.image}
            loading={featured ? 'eager' : 'lazy'}
          />
        )}
        <span
          className={`${styles.categoryBadge} ${
            article.category === 'explainer' ? styles.categoryExplainer : ''
          }`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{formatRelativeTime(article.publishedAt)}</span>
          <span className={styles.dot}>·</span>
          <span>{article.readTimeMinutes} min de leitura</span>
        </div>

        <h3 className={styles.title}>{article.title}</h3>

        {article.subtitle && (
          <p className={styles.subtitle}>{article.subtitle}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.authorName}>{article.author.name}</span>
        </div>
      </div>
    </article>
  );
}
