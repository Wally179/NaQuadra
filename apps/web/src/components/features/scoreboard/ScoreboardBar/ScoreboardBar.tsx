'use client';

import { useRef, useState, MouseEvent } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollCenter = scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children) as HTMLElement[];
    
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(childCenter - scrollCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
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
        onScroll={handleScroll}
      >
        {sorted.map((game) => (
          <GameCard key={game.externalId} game={game} />
        ))}
      </div>

      {sorted.length > 1 && (
        <div className={styles.pagination}>
          {sorted.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Ir para jogo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
