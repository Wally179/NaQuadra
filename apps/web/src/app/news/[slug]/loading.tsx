// ============================================================
// Na Quadra — Article Page Loading Skeleton
// Shows immediately when navigating to /news/[slug].
// The ColdStartBanner appears after 3s if the API is still loading.
// ============================================================

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { ColdStartBanner } from '@/components/ui/ColdStartBanner/ColdStartBanner';
import styles from './NewsArticlePage.module.css';

export default function ArticleLoading() {
  return (
    <>
      {/* Cold start banner — only appears if loading takes >3s */}
      <ColdStartBanner />

      <main className={styles.main}>
        <article className={styles.articleContainer}>
          {/* Header skeleton */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <Skeleton width={70} height={14} />
              <Skeleton width={100} height={14} />
              <Skeleton width={90} height={14} />
            </div>

            <Skeleton width="88%" height={44} style={{ marginTop: '4px' }} />
            <Skeleton width="65%" height={44} />

            <Skeleton width="75%" height={22} style={{ marginTop: '4px' }} />

            <div className={styles.authorSection}>
              <Skeleton width={40} height={40} borderRadius="50%" />
              <Skeleton width={150} height={16} />
            </div>
          </header>

          {/* Cover image skeleton */}
          <Skeleton
            width="100%"
            height={400}
            borderRadius="var(--nq-radius-lg)"
            style={{ aspectRatio: '16/9', height: 'auto', minHeight: '200px' }}
          />

          {/* Content skeleton */}
          <div className={styles.content} style={{ gap: '12px' }}>
            <Skeleton width="100%" height={16} />
            <Skeleton width="97%" height={16} />
            <Skeleton width="94%" height={16} />
            <Skeleton width="99%" height={16} />
            <Skeleton width="88%" height={16} />
            <Skeleton width="95%" height={16} />
            <Skeleton width="72%" height={16} />
          </div>
        </article>
      </main>
    </>
  );
}
