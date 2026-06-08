// ============================================================
// Na Quadra — GameCard Skeleton
// High-fidelity skeleton matching the GameCard layout.
// ============================================================

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './GameCard.module.css';

export function GameCardSkeleton() {
  return (
    <div
      className={styles.gameCard}
      style={{
        '--home-team-color': 'var(--nq-bg-tertiary)',
        '--away-team-color': 'var(--nq-bg-tertiary)',
        pointerEvents: 'none',
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.content}>
        {/* Phase placeholder */}
        <Skeleton width={100} height={12} borderRadius="var(--nq-radius-sm)" />

        {/* Series placeholder */}
        <Skeleton width={140} height={10} borderRadius="var(--nq-radius-sm)" />

        {/* Matchup */}
        <div className={styles.matchup}>
          {/* Home team */}
          <div className={styles.teamSide}>
            <Skeleton width={52} height={52} borderRadius="var(--nq-radius-md)" />
            <Skeleton width={60} height={14} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={40} height={10} borderRadius="var(--nq-radius-sm)" />
          </div>

          {/* Center: time */}
          <div className={styles.center}>
            <Skeleton width={56} height={14} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={70} height={28} borderRadius="var(--nq-radius-sm)" />
          </div>

          {/* Away team */}
          <div className={styles.teamSide}>
            <Skeleton width={52} height={52} borderRadius="var(--nq-radius-md)" />
            <Skeleton width={60} height={14} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={40} height={10} borderRadius="var(--nq-radius-sm)" />
          </div>
        </div>
      </div>
    </div>
  );
}
