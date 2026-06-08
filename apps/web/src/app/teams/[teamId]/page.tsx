import { Suspense } from 'react';
import { getTeam, getAllTeams } from '@/data/teams';
import { fetchTeamRoster, fetchStandings, type RosterPlayer, type StandingsTeam } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
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

// ── Stats & Roster Section (streamed via Suspense) ──
async function TeamDataSection({ teamId, teamAbbr }: { teamId: string; teamAbbr: string }) {
  const [roster, standingsData] = await Promise.all([
    fetchTeamRoster(teamId).catch(() => [] as RosterPlayer[]),
    fetchStandings().catch(() => [] as StandingsTeam[]),
  ]);

  const standing = standingsData.find(
    (s) => s.teamId === teamId || s.teamAbbr.toLowerCase() === teamAbbr.toLowerCase()
  );

  return (
    <>
      {/* === STATS BAR === */}
      {standing && (
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>#{standing.seed}</div>
            <div className={styles.statLabel}>Posição</div>
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
            <div className={styles.statLabel} title="Aproveitamento">Aprov.</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.streak}</div>
            <div className={styles.statLabel}>Sequência</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{standing.gamesBehind}</div>
            <div className={styles.statLabel} title="Jogos atrás do líder">Dif.</div>
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
              <Link 
                key={player.externalId} 
                href={`/players/${player.externalId}`}
                className={styles.playerCard}
              >
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
              </Link>
            ))
          ) : (
            <p className={styles.emptyRoster}>
              Elenco não disponível no momento. Tente novamente mais tarde.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// ── Skeleton for stats+roster while loading ──
function TeamDataSkeleton() {
  return (
    <>
      {/* Stats bar skeleton */}
      <div className={styles.statsBar}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.statCard}>
            <Skeleton width={48} height={28} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={56} height={12} borderRadius="var(--nq-radius-sm)" style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>

      {/* Roster skeleton */}
      <section className={styles.section}>
        <Skeleton width={200} height={24} style={{ marginBottom: 'var(--nq-space-4)' }} />
        <div className={styles.rosterGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.playerCard} style={{ pointerEvents: 'none' }}>
              <Skeleton width={48} height={36} borderRadius="var(--nq-radius-sm)" />
              <Skeleton width={24} height={14} borderRadius="var(--nq-radius-sm)" />
              <Skeleton width={100} height={14} borderRadius="var(--nq-radius-sm)" />
              <Skeleton width={20} height={12} borderRadius="var(--nq-radius-sm)" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
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

  const teamCssVars = {
    '--team-primary': team.colors.primary,
    '--team-secondary': team.colors.secondary,
  } as CSSProperties;

  return (
    <div className={styles.page} style={teamCssVars}>
      {/* === HERO with team color gradient === */}
      {/* Renders IMMEDIATELY — uses only local data from getTeam() */}
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

      {/* === STATS + ROSTER — Streamed via Suspense === */}
      {/* Shows skeleton while API data loads; hero is already visible */}
      <Suspense fallback={<TeamDataSkeleton />}>
        <TeamDataSection teamId={teamId} teamAbbr={team.abbreviation} />
      </Suspense>
    </div>
  );
}
