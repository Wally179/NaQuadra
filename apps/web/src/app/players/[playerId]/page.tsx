import { getTeam } from '@/data/teams';
import { fetchPlayerDetail } from '@/lib/api';
import { PlayerHeadshot } from '@/components/features/players/PlayerHeadshot/PlayerHeadshot';
import Link from 'next/link';
import { Info } from 'lucide-react';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ playerId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { playerId } = await params;
  const player = await fetchPlayerDetail(playerId);
  if (!player) return { title: 'Jogador não encontrado' };
  return {
    title: `NaQuadra — ${player.name} (${player.teamAbbr})`,
    description: `Estatísticas, perfil e informações de ${player.name}.`,
  };
}

const POSITION_LABELS: Record<string, string> = {
  PG: 'Armador', SG: 'Ala-Armador', SF: 'Ala', PF: 'Ala-Pivô', C: 'Pivô',
  G: 'Armador', F: 'Ala',
};

export default async function PlayerDetailPage({ params }: PageProps) {
  const { playerId } = await params;
  const player = await fetchPlayerDetail(playerId);

  if (!player) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Jogador não encontrado</h1>
        <Link href="/" className={styles.backLink}>← Voltar para o início</Link>
      </div>
    );
  }

  // The API returns teamId as a slug directly
  const team = getTeam(player.teamId);

  // Fallback temporary stats (since core API doesn't provide stats in the same endpoint)
  const s = {
    season: '2025-26',
    ppg: 15.4,
    rpg: 5.2,
    apg: 4.1,
    spg: 1.0,
    bpg: 0.5,
    fgPct: 0.48,
    threePct: 0.35,
    ftPct: 0.81,
  };

  const pageCssVars = {
    '--team-primary': team?.colors.primary ?? '#60A5FA',
    '--team-secondary': team?.colors.secondary ?? '#FFFFFF',
  } as CSSProperties;

  return (
    <div className={styles.page} style={pageCssVars}>
      {/* === HERO === */}
      <div className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroInner}>
          <PlayerHeadshot
            src={player.headshot}
            name={player.name}
            className={styles.heroHeadshot}
          />
          <div className={styles.heroInfo}>
            <span className={styles.heroNumber}>#{player.jersey}</span>
            <h1 className={styles.heroName}>{player.name}</h1>
            <div className={styles.heroBadges}>
              <span className={`${styles.badge} ${styles.badgePrimary}`}>
                {POSITION_LABELS[player.position] ?? player.position}
              </span>
              {team && (
                <Link href={`/teams/${team.id}`} style={{ textDecoration: 'none' }}>
                  <span className={styles.badge}>{team.name}</span>
                </Link>
              )}
              <span className={styles.badge}>{player.country || 'EUA'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN STATS === */}
      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionAccent} aria-hidden="true" />
          Estatísticas {s.season}
        </h2>

        <div className={styles.mainStats}>
          {[
            { value: s.ppg.toFixed(1), label: 'PPG', desc: 'Pontos por Jogo: Média de pontos feitos a cada partida.' },
            { value: s.rpg.toFixed(1), label: 'RPG', desc: 'Rebotes por Jogo: Média de bolas recuperadas após um arremesso errado.' },
            { value: s.apg.toFixed(1), label: 'APG', desc: 'Assistências por Jogo: Passes que resultaram diretamente em cesta.' },
            { value: s.spg.toFixed(1), label: 'SPG', desc: 'Roubos por Jogo: Vezes que tomou a bola do adversário.' },
            { value: s.bpg.toFixed(1), label: 'BPG', desc: 'Tocos por Jogo: Arremessos adversários bloqueados.' },
          ].map((stat) => (
            <div key={stat.label} className={styles.mainStatCard}>
              <div className={styles.mainStatValue}>{stat.value}</div>
              <div className={styles.mainStatLabelWrapper}>
                <div className={styles.mainStatLabel}>{stat.label}</div>
                <div className={styles.tooltipContainer}>
                  <Info size={14} className={styles.infoIcon} />
                  <div className={styles.tooltipText}>{stat.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shooting percentages with bar */}
        <div className={styles.shootingStats}>
          {[
            { label: 'AC%', value: s.fgPct, desc: 'Aproveitamento geral: Porcentagem de acerto em todos os arremessos.' },
            { label: '3P%', value: s.threePct, desc: '3 Pontos: Porcentagem de acerto nos arremessos de longa distância.' },
            { label: 'LL%', value: s.ftPct, desc: 'Lance Livre: Porcentagem de acerto nos arremessos sem marcação (após falta).' },
          ].map((stat) => (
            <div key={stat.label} className={styles.shootingCard}>
              <div className={styles.shootingLabelWrapper}>
                <span className={styles.shootingLabel}>{stat.label}</span>
                <div className={styles.tooltipContainer}>
                  <Info size={14} className={styles.infoIcon} />
                  <div className={styles.tooltipText}>{stat.desc}</div>
                </div>
              </div>
              <div className={styles.shootingBar}>
                <div
                  className={styles.shootingFill}
                  style={{ width: `${stat.value * 100}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(stat.value * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className={styles.shootingValue}>
                {(stat.value * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* === BIO + INFO === */}
      <div className={styles.bioSection}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionAccent} aria-hidden="true" />
          Perfil
        </h2>
        <div className={styles.bioCard}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Idade</span>
              <span className={styles.infoValue}>{player.age} anos</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Altura</span>
              <span className={styles.infoValue}>{player.height}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Peso</span>
              <span className={styles.infoValue}>{player.weight}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Draft</span>
              <span className={styles.infoValue}>
                {player.draftInfo || 'Não draftado'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Experiência</span>
              <span className={styles.infoValue}>
                {player.experience ? `${player.experience} anos` : 'Novato'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
