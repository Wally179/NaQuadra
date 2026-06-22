// ============================================================
// Na Quadra — Global Loading (Skeleton-based)
// ============================================================
// Instead of a generic spinner, show a page-level skeleton that
// mirrors the home page structure. This gives the user an instant
// sense of the content that's about to appear.
// ============================================================

import { ScoreboardBarSkeleton } from '@/components/features/scoreboard/ScoreboardBar/ScoreboardBarSkeleton';
import { ArticleCardSkeleton } from '@/components/features/news/ArticleCard/ArticleCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ColdStartBanner } from '@/components/ui/ColdStartBanner/ColdStartBanner';
import styles from './page.module.css';

export default function GlobalLoading() {
  return (
    <>
      {/* Cold start banner — appears after 3s if API is warming up */}
      <ColdStartBanner />

      {/* Scoreboard section skeleton */}
      <section className={styles.heroSection}>
        <ScoreboardBarSkeleton />
      </section>

      {/* News section skeleton */}
      <section className={styles.newsSection}>
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

      {/* Edu section skeleton */}
      <section className={styles.eduSection}>
        <div className={styles.eduCard} style={{ opacity: 0.6 }}>
          <Skeleton width={180} height={14} borderRadius="var(--nq-radius-sm)" />
          <Skeleton width="70%" height={24} borderRadius="var(--nq-radius-sm)" />
          <Skeleton width="100%" height={14} borderRadius="var(--nq-radius-sm)" />
          <Skeleton width="90%" height={14} borderRadius="var(--nq-radius-sm)" />
          <Skeleton width="60%" height={14} borderRadius="var(--nq-radius-sm)" />
        </div>
      </section>
    </>
  );
}
