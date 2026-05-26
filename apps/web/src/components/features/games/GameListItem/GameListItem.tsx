import Link from 'next/link';
import type { GameSummary } from '@naquadra/types';
import type { CSSProperties } from 'react';
import styles from './GameListItem.module.css';

interface GameListItemProps {
  game: GameSummary;
  isFavorite?: boolean;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

export function GameListItem({ game, isFavorite }: GameListItemProps) {
  const { homeTeam, awayTeam, status } = game;

  const cardStyle = {
    '--home-color': homeTeam.colors.primary,
    '--away-color': awayTeam.colors.primary,
  } as CSSProperties;

  return (
    <Link
      href={`/games/${game.id}`}
      className={`${styles.item} ${isFavorite ? styles.itemFavorite : ''}`}
      style={cardStyle}
    >
      {/* Status Badge */}
      <div className={styles.statusBar}>
        {status === 'live' && (
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />
            AO VIVO
          </span>
        )}
        {status === 'scheduled' && (
          <span className={styles.scheduledBadge}>AGENDADO</span>
        )}
        {status === 'final' && (
          <span className={styles.finalBadge}>FINAL</span>
        )}
        {isFavorite && <span className={styles.favStar}>★</span>}
      </div>

      {/* Matchup */}
      <div className={styles.matchup}>
        {/* Away Team */}
        <div className={styles.teamSide}>
          <img
            src={awayTeam.logo}
            alt={awayTeam.name}
            className={styles.logo}
            width={44}
            height={44}
            loading="lazy"
          />
          <div className={styles.teamInfo}>
            <span className={styles.teamAbbr}>{awayTeam.abbreviation}</span>
            <span className={styles.teamRecord}>{awayTeam.record}</span>
          </div>
        </div>

        {/* Center: Score / Time */}
        <div className={styles.center}>
          {status === 'scheduled' ? (
            <time className={styles.gameTime} dateTime={game.startTime}>
              {formatTime(game.startTime)}
            </time>
          ) : (
            <div className={styles.scoreBlock}>
              <span className={`${styles.score} ${game.awayScore !== null && game.homeScore !== null && game.awayScore > game.homeScore ? styles.scoreWin : ''}`}>
                {game.awayScore ?? '-'}
              </span>
              <span className={styles.scoreDivider}>—</span>
              <span className={`${styles.score} ${game.homeScore !== null && game.awayScore !== null && game.homeScore > game.awayScore ? styles.scoreWin : ''}`}>
                {game.homeScore ?? '-'}
              </span>
            </div>
          )}
          {status === 'live' && game.clock && (
            <span className={styles.clockInfo}>
              Q{game.period} · {game.clock}
            </span>
          )}
        </div>

        {/* Home Team */}
        <div className={styles.teamSide}>
          <img
            src={homeTeam.logo}
            alt={homeTeam.name}
            className={styles.logo}
            width={44}
            height={44}
            loading="lazy"
          />
          <div className={styles.teamInfo}>
            <span className={styles.teamAbbr}>{homeTeam.abbreviation}</span>
            <span className={styles.teamRecord}>{homeTeam.record}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {game.venue && <span className={styles.venue}>{game.venue}</span>}
        {game.broadcast && <span className={styles.broadcast}>📺 {game.broadcast}</span>}
      </div>

      {/* Gradient accents */}
      <div className={styles.gradientLeft} />
      <div className={styles.gradientRight} />
    </Link>
  );
}
