// ============================================================
// Na Quadra — Games Page Loading (Skeleton)
// Uses reusable Skeleton components.
// ============================================================

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { GameListItemSkeleton } from '@/components/features/games/GameListItem/GameListItemSkeleton';
import styles from './page.module.css';

export default function GamesLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Skeleton width={200} height={36} style={{ margin: '0 auto' }} />
          <Skeleton width={280} height={18} style={{ margin: '12px auto 0' }} />
        </div>

        {/* Controls: date picker */}
        <div className={styles.controls}>
          <Skeleton width={200} height={36} borderRadius="var(--nq-radius-full)" style={{ margin: '0 auto' }} />
        </div>

        {/* Games list with high-fidelity skeletons */}
        <div className={styles.gamesList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <GameListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
