'use client';

import { useState } from 'react';
import type { GameSummary, GameStatus } from '@naquadra/types';
import styles from './GameStatusFilter.module.css';

interface GameStatusFilterProps {
  games: GameSummary[];
  onFilter: (filtered: GameSummary[]) => void;
}

const STATUS_OPTIONS: { value: GameStatus | 'all' | 'favorites'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'live', label: '🔴 Ao Vivo' },
  { value: 'scheduled', label: 'Agendados' },
  { value: 'final', label: 'Finais' },
];

export function GameStatusFilter({ games, onFilter }: GameStatusFilterProps) {
  const [active, setActive] = useState<string>('all');

  const handleFilter = (value: string) => {
    setActive(value);
    if (value === 'all') {
      onFilter(games);
    } else {
      onFilter(games.filter((g) => g.status === value));
    }
  };

  const liveCount = games.filter((g) => g.status === 'live').length;

  return (
    <div className={styles.filterBar}>
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.filterBtn} ${active === opt.value ? styles.filterBtnActive : ''}`}
          onClick={() => handleFilter(opt.value)}
          type="button"
        >
          {opt.label}
          {opt.value === 'live' && liveCount > 0 && (
            <span className={styles.liveBadge}>{liveCount}</span>
          )}
        </button>
      ))}
    </div>
  );
}
