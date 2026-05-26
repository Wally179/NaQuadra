'use client';

import type { NormalizedGame } from '@naquadra/types';
import Link from 'next/link';
import { GameCard } from '../GameCard/GameCard';
import styles from './ScoreboardBar.module.css';

interface ScoreboardBarProps {
  games: NormalizedGame[];
}

export function ScoreboardBar({ games }: ScoreboardBarProps) {
  if (games.length === 0) {
    return null;
  }

  // Sort by start time since they are future games
  const sorted = [...games].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <section aria-label="Próximos jogos">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🏀 Próximos Jogos</h2>
        <Link href="/games" className={styles.sectionLink}>
          Ver todos →
        </Link>
      </div>
      
      <div className={styles.cardsGrid}>
        {sorted.map((game) => (
          <GameCard key={game.externalId} game={game} />
        ))}
      </div>
    </section>
  );
}
