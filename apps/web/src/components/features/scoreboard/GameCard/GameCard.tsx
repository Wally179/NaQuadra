// ============================================================
// Na Quadra — GameCard: Clash Gradient Component
// ============================================================
// The signature visual component of Na Quadra.
// Team colors "invade" the dark center from both sides.

'use client';

import type { NormalizedGame } from '@naquadra/types';
import type { CSSProperties } from 'react';
import { getTeam } from '@/data/teams';
import { formatToBRT, translatePhase } from '@/lib/formatters';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: NormalizedGame;
}

export function GameCard({ game }: GameCardProps) {
  const homeTeam = getTeam(game.homeTeamId);
  const awayTeam = getTeam(game.awayTeamId);

  if (!homeTeam || !awayTeam) return null;

  const cardStyles = {
    '--home-team-color': homeTeam.colors.primary,
    '--away-team-color': awayTeam.colors.primary,
  } as CSSProperties;

  return (
    <article className={styles.gameCard} style={cardStyles} aria-label={`${homeTeam.name} vs ${awayTeam.name}`}>
      <div className={styles.content}>
        {/* Phase & Series Info */}
        <span className={styles.phase}>
          {game.conference} – {translatePhase(game.phase)}
        </span>
        {game.seriesInfo && (
          <span className={styles.series}>{game.seriesInfo}</span>
        )}

        {/* Matchup */}
        <div className={styles.matchup}>
          {/* Home Team */}
          <div className={styles.teamSide} style={{ '--team-glow': `${homeTeam.colors.primary}40` } as CSSProperties}>
            <img
              src={homeTeam.logo}
              alt={homeTeam.name}
              className={styles.teamLogo}
              width={52}
              height={52}
              loading="lazy"
            />
            <span className={styles.teamName}>{homeTeam.name.split(' ').pop()}</span>
            <span className={styles.teamRecord}>{game.homeRecord}</span>
          </div>

          {/* Center: Time / Score */}
          <div className={styles.center}>
            {game.status === 'scheduled' && (
              <>
                <time className={styles.time} dateTime={game.startTime}>
                  {formatToBRT(game.startTime)}
                </time>
                {game.broadcast && (
                  <span className={styles.broadcast}>{game.broadcast}</span>
                )}
              </>
            )}
            {game.status === 'live' && (
              <>
                <span className={styles.live} aria-label="Ao vivo">
                  <span className={styles.liveDot} aria-hidden="true" />
                  AO VIVO
                </span>
                <span className={styles.score}>
                  {game.homeScore} — {game.awayScore}
                </span>
                <span className={styles.quarter}>
                  {game.quarter} · {game.clock}
                </span>
              </>
            )}
            {game.status === 'final' && (
              <>
                <span className={styles.score}>
                  {game.homeScore} — {game.awayScore}
                </span>
                <span className={styles.finalLabel}>Final</span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className={styles.teamSide} style={{ '--team-glow': `${awayTeam.colors.primary}40` } as CSSProperties}>
            <img
              src={awayTeam.logo}
              alt={awayTeam.name}
              className={styles.teamLogo}
              width={52}
              height={52}
              loading="lazy"
            />
            <span className={styles.teamName}>{awayTeam.name.split(' ').pop()}</span>
            <span className={styles.teamRecord}>{game.awayRecord}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.action} type="button">Detalhes</button>
          <button className={styles.action} type="button">Onde assistir</button>
        </div>
      </div>
    </article>
  );
}
