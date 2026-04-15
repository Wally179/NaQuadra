'use client';

import { useState, useEffect } from 'react';
import type { StandingsEntry } from '@naquadra/types';
import { MOCK_STANDINGS_EAST, MOCK_STANDINGS_WEST } from '@/data/mock-standings';
import { getTeam } from '@/data/teams';
import { fetchStandings, type StandingsTeam } from '@/lib/api';
import styles from './page.module.css';

type ConferenceTab = 'east' | 'west';

/** Map API standings data to StandingsEntry for compatibility */
function mapToStandingsEntry(team: StandingsTeam): StandingsEntry {
  return {
    teamId: team.teamId,
    teamName: team.teamName,
    teamAbbreviation: team.teamAbbr,
    conference: team.conference,
    division: '',
    seed: team.seed,
    wins: team.wins,
    losses: team.losses,
    pct: team.pct,
    gamesBehind: team.gamesBehind,
    streak: team.streak,
    last10: '-',
    homeRecord: '-',
    awayRecord: '-',
    pointsFor: 0,
    pointsAgainst: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export default function StandingsPage() {
  const [conference, setConference] = useState<ConferenceTab>('east');
  const [eastStandings, setEastStandings] = useState<StandingsEntry[]>(MOCK_STANDINGS_EAST);
  const [westStandings, setWestStandings] = useState<StandingsEntry[]>(MOCK_STANDINGS_WEST);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchStandings().then((apiData) => {
      if (apiData.length > 0) {
        const east = apiData
          .filter((t) => t.conference === 'east')
          .map(mapToStandingsEntry);
        const west = apiData
          .filter((t) => t.conference === 'west')
          .map(mapToStandingsEntry);
        if (east.length > 0) setEastStandings(east);
        if (west.length > 0) setWestStandings(west);
        setIsLive(true);
      }
    }).catch(() => {
      // Keep mock data on failure
    });
  }, []);

  const standings = conference === 'east' ? eastStandings : westStandings;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Standings</h1>
        <p className={styles.subtitle}>
          Classificação da NBA — Temporada 2025-26
          {isLive && <span className={styles.liveBadge}>● LIVE</span>}
        </p>
      </div>

      {/* Conference Tabs */}
      <div className={styles.tabs} role="tablist">
        <button
          className={`${styles.tab} ${conference === 'east' ? styles.tabActive : ''}`}
          onClick={() => setConference('east')}
          role="tab"
          aria-selected={conference === 'east'}
        >
          Conferência Leste
        </button>
        <button
          className={`${styles.tab} ${conference === 'west' ? styles.tabActive : ''}`}
          onClick={() => setConference('west')}
          role="tab"
          aria-selected={conference === 'west'}
        >
          Conferência Oeste
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
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
              <th className={styles.numCol}>Últ 10</th>
              <th className={styles.numCol}>CASA</th>
              <th className={styles.numCol}>FORA</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((entry) => (
              <StandingsRow key={entry.teamId} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
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
    </div>
  );
}

function StandingsRow({ entry }: { entry: StandingsEntry }) {
  const team = getTeam(entry.teamId);
  const isStreakWin = entry.streak.startsWith('W');

  // Determine separation lines
  const isPlayoffCutoff = entry.seed === 6;
  const isPlayInCutoff = entry.seed === 10;

  const rowClass = [
    isPlayoffCutoff ? styles.playoffLine : '',
    isPlayInCutoff ? styles.playInLine : '',
  ].filter(Boolean).join(' ');

  return (
    <tr className={rowClass}>
      <td className={styles.seed}>{entry.seed}</td>
      <td>
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
      </td>
      <td className={`${styles.numCol} ${styles.record}`}>{entry.wins}</td>
      <td className={`${styles.numCol} ${styles.record}`}>{entry.losses}</td>
      <td className={`${styles.numCol} ${styles.pct}`}>{entry.pct.toFixed(3).replace('0.', '.')}</td>
      <td className={styles.numCol}>{entry.gamesBehind}</td>
      <td className={`${styles.numCol} ${isStreakWin ? styles.streakW : styles.streakL}`}>
        {entry.streak}
      </td>
      <td className={styles.numCol}>{entry.last10}</td>
      <td className={styles.numCol}>{entry.homeRecord}</td>
      <td className={styles.numCol}>{entry.awayRecord}</td>
    </tr>
  );
}

