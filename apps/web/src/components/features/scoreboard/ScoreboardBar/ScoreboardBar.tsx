'use client';

import type { NormalizedGame } from '@naquadra/types';
import { GameCard } from '../GameCard/GameCard';
import styles from './ScoreboardBar.module.css';

interface ScoreboardBarProps {
  games: NormalizedGame[];
}

export function ScoreboardBar({ games }: ScoreboardBarProps) {
  if (games.length === 0) return null;

  // Sort: live first, then scheduled, then final
  const sorted = [...games].sort((a, b) => {
    const order = { live: 0, scheduled: 1, final: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <section aria-label="Jogos do dia">
      <p className={styles.sectionTitle}>🏀 Jogos de Hoje</p>
      <div className={styles.scoreboardBar}>
        <div className={styles.track}>
          {sorted.map((game) => (
            <GameCard key={game.externalId} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
