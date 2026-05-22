'use client';

import type { NormalizedGame } from '@naquadra/types';
import { GameCard } from '../GameCard/GameCard';
import styles from './ScoreboardBar.module.css';

interface ScoreboardBarProps {
  games: NormalizedGame[];
}

export function ScoreboardBar({ games }: ScoreboardBarProps) {
  if (games.length === 0) {
    return (
      <section aria-label="Jogos do dia">
        <p className={styles.sectionTitle}>🏀 Jogos de Hoje</p>
        <div style={{ backgroundColor: 'var(--nq-bg-secondary)', padding: 'var(--nq-space-6)', borderRadius: 'var(--nq-radius-md)', textAlign: 'center', color: 'var(--nq-text-tertiary)', border: '1px dashed var(--nq-border-subtle)', margin: 'var(--nq-space-4) 0' }}>
          Nenhum jogo da NBA programado para hoje. Aproveite a folga! 😴
        </div>
      </section>
    );
  }

  // Sort: live first, then scheduled, then final
  const sorted = [...games].sort((a, b) => {
    const order = { live: 0, scheduled: 1, final: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <section aria-label="Jogos do dia">
      <p className={styles.sectionTitle}>🏀 Jogos de Hoje</p>
      <div className={styles.scoreboardBar}>
        <div className={styles.track} aria-live="polite" aria-atomic="false">
          {sorted.map((game) => (
            <GameCard key={game.externalId} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
