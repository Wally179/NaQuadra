// ============================================================
// Na Quadra — ArticleCard Skeleton
// Matches the ArticleCard layout: image, badge, title, meta.
// ============================================================

import { Skeleton, SkeletonText } from '@/components/ui/Skeleton/Skeleton';
import styles from './ArticleCard.module.css';

interface ArticleCardSkeletonProps {
  featured?: boolean;
}

export function ArticleCardSkeleton({ featured = false }: ArticleCardSkeletonProps) {
  return (
    <article
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className={styles.imageWrapper}>
        <Skeleton
          width="100%"
          height="100%"
          borderRadius={0}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Meta: time + read time */}
        <div className={styles.meta}>
          <Skeleton width={60} height={12} borderRadius="var(--nq-radius-sm)" />
          <Skeleton width={4} height={4} borderRadius="50%" />
          <Skeleton width={80} height={12} borderRadius="var(--nq-radius-sm)" />
        </div>

        {/* Title */}
        <SkeletonText lines={2} lineHeight="18px" lastLineWidth="75%" />

        {/* Subtitle (only on featured) */}
        {featured && (
          <SkeletonText lines={2} lineHeight="14px" lastLineWidth="50%" />
        )}

        {/* Author */}
        <div className={styles.footer}>
          <Skeleton width={90} height={12} borderRadius="var(--nq-radius-sm)" />
        </div>
      </div>
    </article>
  );
}
