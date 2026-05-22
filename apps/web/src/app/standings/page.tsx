import type { Metadata } from 'next';
import { fetchStandings, type StandingsTeam } from '@/lib/api';
import type { StandingsEntry } from '@naquadra/types';
import { StandingsClient } from './StandingsClient';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Classificação | Na Quadra',
  description: 'Classificação atualizada da temporada da NBA.',
};

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

export default async function StandingsPage() {
  const apiData = await fetchStandings();
  
  const eastStandings = apiData
    .filter((t) => t.conference === 'east')
    .map(mapToStandingsEntry);
    
  const westStandings = apiData
    .filter((t) => t.conference === 'west')
    .map(mapToStandingsEntry);

  return (
    <div className={styles.page}>
      <StandingsClient 
        eastStandings={eastStandings} 
        westStandings={westStandings} 
        isLive={apiData.length > 0} 
      />
    </div>
  );
}

