'use client';

import { useRef, useState, MouseEvent } from 'react';
import type { NormalizedGame } from '@naquadra/types';
import Link from 'next/link';
import { GameCard } from '../GameCard/GameCard';
import { ChampionCard, type ChampionInfo } from '../ChampionCard/ChampionCard';
import styles from './ScoreboardBar.module.css';

interface ScoreboardBarProps {
  games: NormalizedGame[];
  isOffseason?: boolean;
  champion?: ChampionInfo;
}

export function ScoreboardBar({ games, isOffseason = false, champion }: ScoreboardBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  if (games.length === 0 && !isOffseason) {
    return null;
  }

  // Sort by start time since they are future games
  const sorted = [...games].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  // Total items: games + champion card (if offseason)
  const totalItems = sorted.length + (isOffseason && champion ? 1 : 0);

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

  const handleScroll = () => {
    // Scroll behavior no longer controls the active dot per user request
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children[index] && children[0]) {
      container.scrollTo({
        left: children[index].offsetLeft - children[0].offsetLeft,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  // Determine section title based on state
  const sectionTitle = isOffseason
    ? 'Último Jogo da Temporada'
    : 'Próximos Jogos';

  return (
    <section aria-label={sectionTitle}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
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
        onScroll={handleScroll}
      >
        {sorted.map((game, index) => (
          <div key={game.externalId} onMouseEnter={() => setActiveIndex(index)}>
            <GameCard game={game} />
          </div>
        ))}

        {/* Champion commemorative card (offseason only) */}
        {isOffseason && champion && (
          <div onMouseEnter={() => setActiveIndex(sorted.length)}>
            <ChampionCard champion={champion} />
          </div>
        )}
      </div>

      {totalItems > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
              onClick={() => scrollTo(index)}
              onMouseEnter={() => setActiveIndex(index)}
              aria-label={`Ir para item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
