// ============================================================
// Na Quadra — News Page Loading (Skeleton)
// Uses reusable Skeleton components.
// ============================================================

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ArticleCardSkeleton } from '@/components/features/news/ArticleCard/ArticleCardSkeleton';

export default function NewsLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-xl)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Title */}
      <Skeleton width={180} height={40} style={{ marginBottom: 'var(--nq-space-2)' }} />
      <Skeleton width={320} height={18} style={{ marginBottom: 'var(--nq-space-6)' }} />

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-3)', marginBottom: 'var(--nq-space-6)' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === 0 ? 70 : 90}
            height={36}
            borderRadius="var(--nq-radius-full)"
          />
        ))}
      </div>

      {/* Articles grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--nq-space-6)' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
