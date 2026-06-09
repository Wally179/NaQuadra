'use client';

import { useRef, MouseEvent } from 'react';
import type { NormalizedGame } from '@naquadra/types';
import Link from 'next/link';
import { GameCard } from '../GameCard/GameCard';
import styles from './ScoreboardBar.module.css';

interface ScoreboardBarProps {
  games: NormalizedGame[];
}

export function ScoreboardBar({ games }: ScoreboardBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  if (games.length === 0) {
    return null;
  }

  // Sort by start time since they are future games
  const sorted = [...games].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  const onMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const onClickCapture = (e: MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section aria-label="Próximos jogos">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Próximos Jogos</h2>
        <Link href="/games" className={styles.sectionLink}>
          Ver todos →
        </Link>
      </div>
      
      <div 
        className={styles.cardsGrid}
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onClickCapture={onClickCapture}
      >
        {sorted.map((game) => (
          <GameCard key={game.externalId} game={game} />
        ))}
      </div>
    </section>
  );
}
