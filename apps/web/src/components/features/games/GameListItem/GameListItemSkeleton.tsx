// ============================================================
// Na Quadra — GameListItem Skeleton
// Matches the game list item layout on /games page.
// ============================================================

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './GameListItem.module.css';

export function GameListItemSkeleton() {
  return (
    <div
      className={styles.item}
      style={{
        '--home-color': 'var(--nq-border-default)',
        '--away-color': 'var(--nq-border-default)',
        pointerEvents: 'none',
      } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Status bar */}
      <div className={styles.statusBar}>
        <Skeleton width={80} height={20} borderRadius="var(--nq-radius-full)" />
      </div>

      {/* Matchup */}
      <div className={styles.matchup}>
        {/* Away team */}
        <div className={styles.teamSide}>
          <Skeleton width={44} height={44} borderRadius="var(--nq-radius-md)" />
          <div className={styles.teamInfo}>
            <Skeleton width={40} height={18} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={30} height={12} borderRadius="var(--nq-radius-sm)" />
          </div>
        </div>

        {/* Center */}
        <div className={styles.center}>
          <Skeleton width={70} height={24} borderRadius="var(--nq-radius-sm)" />
        </div>

        {/* Home team */}
        <div className={styles.teamSide}>
          <Skeleton width={44} height={44} borderRadius="var(--nq-radius-md)" />
          <div className={styles.teamInfo}>
            <Skeleton width={40} height={18} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={30} height={12} borderRadius="var(--nq-radius-sm)" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Skeleton width={120} height={12} borderRadius="var(--nq-radius-sm)" />
        <Skeleton width={60} height={12} borderRadius="var(--nq-radius-sm)" />
      </div>

      {/* Gradient accents */}
      <div className={styles.gradientLeft} />
      <div className={styles.gradientRight} />
    </div>
  );
}
