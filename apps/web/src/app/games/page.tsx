'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchGamesList } from '@/lib/api';
import { GameListItem } from '@/components/features/games/GameListItem/GameListItem';
import { GameDatePicker, getToday } from '@/components/features/games/GameDatePicker/GameDatePicker';
import { GameStatusFilter } from '@/components/features/games/GameStatusFilter/GameStatusFilter';
import type { GameSummary } from '@naquadra/types';
import styles from './page.module.css';

export default function GamesPage() {
  const [date, setDate] = useState(getToday());
  const [allGames, setAllGames] = useState<GameSummary[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGames = useCallback(async (dateStr: string) => {
    setLoading(true);
    try {
      const games = await fetchGamesList(dateStr);
      // Sort: live first, then scheduled by time, then final
      const sorted = [...games].sort((a, b) => {
        const order = { live: 0, scheduled: 1, final: 2 };
        const diff = order[a.status] - order[b.status];
        if (diff !== 0) return diff;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
      setAllGames(sorted);
      setFilteredGames(sorted);
    } catch {
      setAllGames([]);
      setFilteredGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames(date);
  }, [date, loadGames]);

  // Polling: refresh every 30s if there are live games
  useEffect(() => {
    const hasLive = allGames.some((g) => g.status === 'live');
    if (!hasLive) return;

    const interval = setInterval(() => {
      loadGames(date);
    }, 30_000);

    return () => clearInterval(interval);
  }, [allGames, date, loadGames]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🏀 Jogos da NBA</h1>
          <p className={styles.subtitle}>Acompanhe todos os jogos em tempo real</p>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <GameDatePicker currentDate={date} onDateChange={handleDateChange} />
          {allGames.length > 0 && (
            <GameStatusFilter games={allGames} onFilter={setFilteredGames} />
          )}
        </div>

        {/* Games List */}
        {loading ? (
          <div className={styles.gamesList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${styles.skeleton} skeleton`} />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🏖️</span>
            <p className={styles.emptyText}>
              {allGames.length === 0
                ? 'Nenhum jogo programado para este dia.'
                : 'Nenhum jogo encontrado com este filtro.'}
            </p>
          </div>
        ) : (
          <div className={styles.gamesList}>
            {filteredGames.map((game) => (
              <GameListItem key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* Live indicator */}
        {allGames.some((g) => g.status === 'live') && (
          <div className={styles.liveNotice}>
            <span className={styles.liveNoticeDot} />
            Atualizando automaticamente
          </div>
        )}
      </div>
    </div>
  );
}
