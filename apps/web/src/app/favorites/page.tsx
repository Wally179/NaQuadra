'use client';

import Link from 'next/link';
import { getTeam } from '@/data/teams';
import { MOCK_STANDINGS_EAST, MOCK_STANDINGS_WEST } from '@/data/mock-standings';
import type { CSSProperties } from 'react';
import styles from './page.module.css';

// Simulating a "logged-in" user with favorite teams for demo
// In production this would come from auth context / API
const DEMO_FAV_TEAMS = ['lal', 'bos', 'okc'];
const IS_LOGGED_IN = true; // flip to false to see auth gate

export default function FavoritesPage() {
  if (!IS_LOGGED_IN) {
    return (
      <div className={styles.page}>
        <div className={styles.authGate}>
          <div className={styles.authGateIcon}>❤️</div>
          <h1 className={styles.authGateTitle}>Seus Favoritos</h1>
          <p className={styles.authGateText}>
            Faça login para salvar seus times e jogadores favoritos e personalize sua experiência no Na Quadra.
          </p>
          <Link href="/login" className={styles.loginBtn}>Entrar na Quadra</Link>
        </div>
      </div>
    );
  }

  const allStandings = [...MOCK_STANDINGS_EAST, ...MOCK_STANDINGS_WEST];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Meus Favoritos</h1>
      <p className={styles.subtitle}>Times e jogadores que você acompanha</p>

      {/* Favorite teams */}
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionAccent} aria-hidden="true" />
          Times Favoritos
        </h2>
        <Link href="/teams" className={styles.sectionLink}>+ Adicionar</Link>
      </div>

      <div className={styles.teamsGrid}>
        {DEMO_FAV_TEAMS.map((teamId) => {
          const team = getTeam(teamId);
          const record = allStandings.find((s) => s.teamId === teamId);
          if (!team) return null;
          return (
            <Link
              key={teamId}
              href={`/teams/${teamId}`}
              className={styles.favTeamCard}
              style={{ '--card-color': team.colors.primary } as CSSProperties}
            >
              <img src={team.logo} alt={team.name} className={styles.favTeamLogo} width={56} height={56} />
              <span className={styles.favTeamName}>{team.name}</span>
              {record && (
                <span className={styles.favTeamRecord}>{record.wins}V · {record.losses}D</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Empty state for players */}
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionAccent} aria-hidden="true" />
          Jogadores Favoritos
        </h2>
        <Link href="/search" className={styles.sectionLink}>+ Adicionar</Link>
      </div>

      <div className={styles.authGate} style={{ margin: 0 }}>
        <div className={styles.authGateIcon}>🏀</div>
        <p className={styles.authGateText}>
          Busque jogadores para adicioná-los aos seus favoritos.
        </p>
        <Link href="/search" className={styles.loginBtn}>Buscar Jogadores</Link>
      </div>
    </div>
  );
}
