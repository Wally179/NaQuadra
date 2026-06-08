'use client';

import { useState, memo } from 'react';
import type { StandingsEntry } from '@naquadra/types';
import Link from 'next/link';
import { getTeam } from '@/data/teams';
import { translateStreak } from '@/lib/formatters';
import styles from './page.module.css';

type ConferenceTab = 'east' | 'west';

interface StandingsClientProps {
  eastStandings: StandingsEntry[];
  westStandings: StandingsEntry[];
  isLive: boolean;
}

export function StandingsClient({ eastStandings, westStandings, isLive }: StandingsClientProps) {
  const [conference, setConference] = useState<ConferenceTab>('east');
  const standings = conference === 'east' ? eastStandings : westStandings;

  const hasLast10 = standings.some(e => e.last10 && e.last10 !== '-');
  const hasHomeRecord = standings.some(e => e.homeRecord && e.homeRecord !== '-');
  const hasAwayRecord = standings.some(e => e.awayRecord && e.awayRecord !== '-');

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Classificação</h1>
        <p className={styles.subtitle}>
          Classificação da NBA — Temporada 2025-26
          {isLive && <span className={styles.liveBadge}>● AO VIVO</span>}
        </p>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Conferências da NBA">
        <button
          id="tab-east"
          aria-controls="panel-standings"
          className={`${styles.tab} ${conference === 'east' ? styles.tabActive : ''}`}
          onClick={() => setConference('east')}
          role="tab"
          aria-selected={conference === 'east'}
          tabIndex={conference === 'east' ? 0 : -1}
        >
          Conferência Leste
        </button>
        <button
          id="tab-west"
          aria-controls="panel-standings"
          className={`${styles.tab} ${conference === 'west' ? styles.tabActive : ''}`}
          onClick={() => setConference('west')}
          role="tab"
          aria-selected={conference === 'west'}
          tabIndex={conference === 'west' ? 0 : -1}
        >
          Conferência Oeste
        </button>
      </div>

      <div 
        id="panel-standings"
        role="tabpanel"
        aria-labelledby={conference === 'east' ? 'tab-east' : 'tab-west'}
        className={styles.tableWrapper}
        tabIndex={0}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>TIME</th>
              <th className={styles.numCol}>V</th>
              <th className={styles.numCol}>D</th>
              <th className={styles.numCol}>%</th>
              <th className={styles.numCol}>GB</th>
              <th className={styles.numCol}>SEQ</th>
              {hasLast10 && <th className={styles.numCol}>Últ 10</th>}
              {hasHomeRecord && <th className={styles.numCol}>CASA</th>}
              {hasAwayRecord && <th className={styles.numCol}>FORA</th>}
            </tr>
          </thead>
          <tbody>
            {standings.map((entry) => (
              <StandingsRow 
                key={entry.teamId} 
                entry={entry} 
                hasLast10={hasLast10}
                hasHomeRecord={hasHomeRecord}
                hasAwayRecord={hasAwayRecord}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendLine} ${styles.legendSolid}`} />
          Classificação automática Playoffs (1-6)
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendLine} ${styles.legendDashed}`} />
          Play-In (7-10)
        </div>
      </div>
    </>
  );
}

const StandingsRow = memo(function StandingsRow({ 
  entry, 
  hasLast10, 
  hasHomeRecord, 
  hasAwayRecord 
}: { 
  entry: StandingsEntry;
  hasLast10: boolean;
  hasHomeRecord: boolean;
  hasAwayRecord: boolean;
}) {
  const team = getTeam(entry.teamId);
  const isStreakWin = entry.streak.startsWith('W');

  // Determine separation lines
  const isPlayoffCutoff = entry.seed === 6;
  const isPlayInCutoff = entry.seed === 10;

  const rowClass = [
    isPlayoffCutoff ? styles.playoffLine : '',
    isPlayInCutoff ? styles.playInLine : '',
  ].filter(Boolean).join(' ');

  const rowStyle = team ? { '--row-team-color': team.colors.primary } as React.CSSProperties : {};

  return (
    <tr className={rowClass} style={rowStyle}>
      <td className={styles.seed}>{entry.seed}</td>
      <td>
        <Link href={`/teams/${entry.teamId}`} className={styles.teamCellLink}>
          <div className={styles.teamCell}>
            {team && (
              <img
                src={team.logo}
                alt={entry.teamName}
                className={styles.teamLogo}
                width={28}
                height={28}
                loading="lazy"
              />
            )}
            <span className={styles.teamName}>{entry.teamName}</span>
            <span className={styles.teamAbbr}>{entry.teamAbbreviation}</span>
          </div>
        </Link>
      </td>
      <td className={`${styles.numCol} ${styles.record}`}>{entry.wins}</td>
      <td className={`${styles.numCol} ${styles.record}`}>{entry.losses}</td>
      <td className={`${styles.numCol} ${styles.pct}`}>{entry.pct.toFixed(3).replace('0.', '.')}</td>
      <td className={styles.numCol}>{entry.gamesBehind}</td>
      <td className={`${styles.numCol} ${isStreakWin ? styles.streakW : styles.streakL}`}>
        {translateStreak(entry.streak)}
      </td>
      {hasLast10 && <td className={styles.numCol}>{entry.last10}</td>}
      {hasHomeRecord && <td className={styles.numCol}>{entry.homeRecord}</td>}
      {hasAwayRecord && <td className={styles.numCol}>{entry.awayRecord}</td>}
    </tr>
  );
});
