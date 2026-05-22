import { getTeam, getAllTeams } from '@/data/teams';
import { fetchTeamRoster, fetchStandings, type RosterPlayer, type StandingsTeam } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export async function generateStaticParams() {
  return getAllTeams().map((team) => ({ teamId: team.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { teamId } = await params;
  const team = getTeam(teamId);
  if (!team) return { title: 'Time não encontrado' };
  return {
    title: `NaQuadra — ${team.name}`,
    description: `Tudo sobre o ${team.name}: elenco, estatísticas, notícias e história.`,
  };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { teamId } = await params;
  const team = getTeam(teamId);

  if (!team) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Time não encontrado</h1>
        <Link href="/teams" className={styles.backLink}>
          ← Voltar para a lista de times
        </Link>
      </div>
    );
  }

  // Fetch real data from API (parallel requests)
  const [roster, standingsData] = await Promise.all([
    fetchTeamRoster(teamId).catch(() => [] as RosterPlayer[]),
    fetchStandings().catch(() => [] as StandingsTeam[]),
  ]);

  const standing = standingsData.find(
    (s) => s.teamId === teamId || s.teamAbbr.toLowerCase() === team.abbreviation.toLowerCase()
  );

  const teamCssVars = {
    '--team-primary': team.colors.primary,
    '--team-secondary': team.colors.secondary,
  } as CSSProperties;

  return (
    <div className={styles.page} style={teamCssVars}>
      {/* === HERO with team color gradient === */}
      <div className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <img
          src={team.logo}
          alt={team.name}
          className={styles.heroLogo}
          width={120}
          height={120}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.teamName}>{team.name}</h1>
          <p className={styles.teamCity}>{team.city}</p>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeTeam}`}>
              {team.conference === 'east' ? 'Conferência Leste' : 'Conferência Oeste'}
            </span>
            <span className={styles.badge}>{team.division}</span>
          </div>
        </div>
      </div>

      {/* === STATS BAR === */}
      {standing && (
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>#{standing.seed}</div>
            <div className={styles.statLabel}>Seed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.wins}</div>
            <div className={styles.statLabel}>Vitórias</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.losses}</div>
            <div className={styles.statLabel}>Derrotas</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.pct.toFixed(3).replace('0.', '.')}</div>
            <div className={styles.statLabel}>Win %</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.streak}</div>
            <div className={styles.statLabel}>Sequência</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.gamesBehind}</div>
            <div className={styles.statLabel}>GB</div>
          </div>
        </div>
      )}

      {/* === ROSTER === */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionAccent} aria-hidden="true" />
          Elenco {roster.length > 0 ? `(${roster.length} jogadores)` : 'Principal'}
        </h2>
        <div className={styles.rosterGrid}>
          {roster.length > 0 ? (
            roster.map((player) => (
              <div key={player.externalId} className={styles.playerCard}>
                {player.headshot && (
                  <img
                    src={player.headshot}
                    alt={player.name}
                    className={styles.playerHeadshot}
                    width={48}
                    height={36}
                    loading="lazy"
                  />
                )}
                <span className={styles.playerNumber}>#{player.jersey}</span>
                <span className={styles.playerName}>{player.name}</span>
                <span className={styles.playerPosition}>{player.position}</span>
              </div>
            ))
          ) : (
            <p className={styles.emptyRoster}>
              Elenco não disponível no momento. Tente novamente mais tarde.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

