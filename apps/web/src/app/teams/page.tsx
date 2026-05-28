import Link from 'next/link';
import { getAllTeams } from '@/data/teams';
import type { Metadata } from 'next';
import styles from './page.module.css';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Times NBA',
  description: 'Todos os 30 times da NBA. Conferência Leste e Oeste, logos, cores e informações.',
};

export default function TeamsPage() {
  const allTeams = getAllTeams();
  const eastTeams = allTeams.filter((t) => t.conference === 'east').sort((a, b) => a.name.localeCompare(b.name));
  const westTeams = allTeams.filter((t) => t.conference === 'west').sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Times</h1>
      <p className={styles.subtitle}>Todas as 30 franquias da liga</p>

      {/* Eastern Conference */}
      <section className={styles.conferenceSection}>
        <h2 className={styles.conferenceTitle}>
          Conferência Leste
          <span className={styles.conferenceBadge}>15 times</span>
        </h2>
        <div className={styles.teamsGrid}>
          {eastTeams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={styles.teamCard}
              style={{ '--card-team-color': team.colors.primary } as CSSProperties}
            >
              <img
                src={team.logo}
                alt={team.name}
                className={styles.teamCardLogo}
                width={44}
                height={44}
                loading="lazy"
              />
              <div className={styles.teamCardInfo}>
                <span className={styles.teamCardName}>{team.name}</span>
                <span className={styles.teamCardDetail}>{team.city}</span>
                <span className={styles.teamCardDivision}>{team.division}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Western Conference */}
      <section className={styles.conferenceSection}>
        <h2 className={styles.conferenceTitle}>
          Conferência Oeste
          <span className={styles.conferenceBadge}>15 times</span>
        </h2>
        <div className={styles.teamsGrid}>
          {westTeams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={styles.teamCard}
              style={{ '--card-team-color': team.colors.primary } as CSSProperties}
            >
              <img
                src={team.logo}
                alt={team.name}
                className={styles.teamCardLogo}
                width={44}
                height={44}
                loading="lazy"
              />
              <div className={styles.teamCardInfo}>
                <span className={styles.teamCardName}>{team.name}</span>
                <span className={styles.teamCardDetail}>{team.city}</span>
                <span className={styles.teamCardDivision}>{team.division}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
