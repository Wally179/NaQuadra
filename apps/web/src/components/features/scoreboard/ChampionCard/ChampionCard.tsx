// ============================================================
// Na Quadra — ChampionCard: NBA Champion Commemorative Card
// ============================================================
// Shown during the offseason to celebrate the current NBA champion.

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { getTeam } from '@/data/teams';
import styles from './ChampionCard.module.css';

export interface ChampionInfo {
  teamId: string;
  season: string;          // e.g. "2025-26"
  seriesResult: string;    // e.g. "4-1 vs Spurs"
  mvp: string;             // e.g. "Jalen Brunson"
}

interface ChampionCardProps {
  champion: ChampionInfo;
}

export function ChampionCard({ champion }: ChampionCardProps) {
  const team = getTeam(champion.teamId);
  if (!team) return null;

  const cardStyles = {
    '--champion-color': team.colors.primary,
  } as CSSProperties;

  return (
    <Link
      href={`/teams/${team.id}`}
      className={styles.championCard}
      style={cardStyles}
      aria-label={`${team.name} — Campeões da NBA ${champion.season}`}
    >
      {/* Confetti particles */}
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.confettiPiece} />
        ))}
      </div>

      <div className={styles.content}>
        <span className={styles.topLabel}>NBA {champion.season}</span>

        <div className={styles.trophyRow}>
          <img
            src={team.logo}
            alt={team.name}
            className={styles.teamLogo}
            width={64}
            height={64}
          />
          <span className={styles.trophy} aria-hidden="true">🏆</span>
        </div>

        <span className={styles.teamName}>{team.name}</span>
        <span className={styles.championTitle}>Campeões da NBA</span>
        <span className={styles.seriesResult}>{champion.seriesResult}</span>

        {champion.mvp && (
          <span className={styles.mvpBadge}>
            ⭐ MVP das Finais: {champion.mvp}
          </span>
        )}
      </div>
    </Link>
  );
}
