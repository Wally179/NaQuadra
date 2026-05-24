'use client';

import type { Article } from '@/lib/api';
import { formatRelativeTime } from '@/lib/formatters';
import Link from 'next/link';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  news: 'Notícia',
  analysis: 'Análise',
  feature: 'Destaque',
  explainer: 'Explicação',
  highlight: 'Destaque',
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none', display: 'contents' }}>
      <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className={styles.image}
            loading={featured ? 'eager' : 'lazy'}
          />
        ) : (
          <div className={`${styles.image} ${styles.imagePlaceholder}`}>
            <span className={styles.placeholderIcon}>🏀</span>
          </div>
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
  </Link>
  );
}
