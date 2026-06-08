// ============================================================
// Na Quadra — ScoreboardBar Skeleton
// Shows placeholder game cards in the scoreboard section.
// ============================================================

import { GameCardSkeleton } from '../GameCard/GameCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './ScoreboardBar.module.css';

export function ScoreboardBarSkeleton() {
  return (
    <section aria-label="Carregando próximos jogos" aria-hidden="true">
      <div className={styles.sectionHeader}>
        <Skeleton width={180} height={28} borderRadius="var(--nq-radius-sm)" />
        <Skeleton width={80} height={16} borderRadius="var(--nq-radius-sm)" />
      </div>
      <div className={styles.cardsGrid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
