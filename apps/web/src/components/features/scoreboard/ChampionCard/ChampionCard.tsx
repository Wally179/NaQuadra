// ============================================================
// Na Quadra — ChampionCard: NBA Champion Commemorative Card
// ============================================================

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { getTeam } from '@/data/teams';
import styles from './ChampionCard.module.css';

export interface ChampionInfo {
  teamId: string;
  season: string;
  seriesResult: string;
  mvp: string;
}

interface ChampionCardProps {
  champion: ChampionInfo;
}

export function ChampionCard({ champion }: ChampionCardProps) {
  const team = getTeam(champion.teamId);
  if (!team) return null;

  return (
    <Link
      href={`/teams/${team.id}`}
      className={styles.championCard}
      style={{ '--champion-color': team.colors.primary } as CSSProperties}
      aria-label={`${team.name} — Campeões da NBA ${champion.season}`}
    >
      <div className={styles.content}>
        <span className={styles.topLabel}>NBA {champion.season}</span>
        <div className={styles.trophyRow}>
          <img src={team.logo} alt={team.name} className={styles.teamLogo} width={48} height={48} />
          <span className={styles.trophy}>🏆</span>
        </div>
        <span className={styles.teamName}>{team.name}</span>
        <span className={styles.championTitle}>Campeões da NBA</span>
        <span className={styles.seriesResult}>{champion.seriesResult}</span>
        {champion.mvp && (
          <span className={styles.mvpBadge}>⭐ MVP: {champion.mvp}</span>
        )}
      </div>
    </Link>
  );
}
