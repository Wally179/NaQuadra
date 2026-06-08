// ============================================================
// Na Quadra — News Section Skeleton
// Fallback UI shown while NewsSection streams data.
// ============================================================

import { ArticleCardSkeleton } from '@/components/features/news/ArticleCard/ArticleCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from '../page.module.css';

export function NewsSectionSkeleton() {
  return (
    <section className={styles.newsSection} aria-hidden="true">
      <div className={styles.sectionHeader}>
        <Skeleton width={200} height={28} borderRadius="var(--nq-radius-sm)" />
        <Skeleton width={80} height={16} borderRadius="var(--nq-radius-sm)" />
      </div>
      <div className={styles.articlesGrid}>
        <ArticleCardSkeleton featured />
        {Array.from({ length: 4 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
