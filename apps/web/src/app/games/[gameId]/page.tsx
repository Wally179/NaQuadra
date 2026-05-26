'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchGameDetail, fetchGamePlays } from '@/lib/api';
import type {
  GameDetail,
  GamePlayByPlayEvent,
  GameTeamStatsComparison,
  GameLeadersData,
  GamePlayerStatsGroup,
  PeriodScore,
} from '@naquadra/types';
import type { CSSProperties } from 'react';
import styles from './page.module.css';

// ── Inline sub-components (kept in one file for Phase 1) ──

function LiveScoreHeader({ detail }: { detail: GameDetail }) {
  const { summary } = detail;
  const { homeTeam, awayTeam } = summary;

  const cardStyle = {
    '--home-color': homeTeam.colors.primary,
    '--away-color': awayTeam.colors.primary,
  } as CSSProperties;

  return (
    <div className={styles.scoreHeader} style={cardStyle}>
      {/* Status */}
      <div className={styles.statusRow}>
        {summary.status === 'live' && (
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />
            AO VIVO · Q{summary.period} · {summary.clock}
          </span>
        )}
        {summary.status === 'final' && (
          <span className={styles.finalBadge}>ENCERRADO</span>
        )}
        {summary.status === 'scheduled' && (
          <span className={styles.scheduledBadge}>
            {new Date(summary.startTime).toLocaleTimeString('pt-BR', {
              hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
            })}
          </span>
        )}
      </div>

      {/* Score strip */}
      <div className={styles.scoreStrip}>
        <div className={styles.teamBlock}>
          <img src={awayTeam.logo} alt={awayTeam.name} className={styles.teamLogo} width={56} height={56} />
          <span className={styles.teamName}>{awayTeam.abbreviation}</span>
          <span className={styles.teamRecord}>{awayTeam.record}</span>
        </div>

        <div className={styles.scoreCenter}>
          {summary.status !== 'scheduled' ? (
            <div className={styles.bigScore}>
              <span className={`${styles.scoreNum} ${(summary.awayScore ?? 0) > (summary.homeScore ?? 0) ? styles.scoreWin : ''}`}>
                {summary.awayScore ?? 0}
              </span>
              <span className={styles.scoreSep}>—</span>
              <span className={`${styles.scoreNum} ${(summary.homeScore ?? 0) > (summary.awayScore ?? 0) ? styles.scoreWin : ''}`}>
                {summary.homeScore ?? 0}
              </span>
            </div>
          ) : (
            <span className={styles.vsLabel}>VS</span>
          )}
        </div>

        <div className={styles.teamBlock}>
          <img src={homeTeam.logo} alt={homeTeam.name} className={styles.teamLogo} width={56} height={56} />
          <span className={styles.teamName}>{homeTeam.abbreviation}</span>
          <span className={styles.teamRecord}>{homeTeam.record}</span>
        </div>
      </div>

      {/* Period scores */}
      {summary.periodScores && summary.periodScores.length > 0 && (
        <div className={styles.periodScores}>
          {summary.periodScores.map((ps) => (
            <div key={ps.period} className={styles.periodCol}>
              <span className={styles.periodLabel}>{ps.label}</span>
              <span className={styles.periodValue}>{ps.awayScore}</span>
              <span className={styles.periodValue}>{ps.homeScore}</span>
            </div>
          ))}
          <div className={styles.periodCol}>
            <span className={styles.periodLabel}>T</span>
            <span className={`${styles.periodValue} ${styles.periodTotal}`}>{summary.awayScore}</span>
            <span className={`${styles.periodValue} ${styles.periodTotal}`}>{summary.homeScore}</span>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className={styles.metaRow}>
        {summary.venue && <span>📍 {summary.venue}</span>}
        {summary.broadcast && <span>📺 {summary.broadcast}</span>}
        {summary.seriesInfo && <span>🏆 {summary.seriesInfo}</span>}
      </div>

      {/* Gradient accents */}
      <div className={styles.headerGradientLeft} />
      <div className={styles.headerGradientRight} />
    </div>
  );
}

function GameLeadersSection({ leaders }: { leaders: GameLeadersData }) {
  const categories = [
    { key: 'points' as const, label: 'Pontos' },
    { key: 'rebounds' as const, label: 'Rebotes' },
    { key: 'assists' as const, label: 'Assistências' },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Líderes</h3>
      <div className={styles.leadersGrid}>
        {categories.map(({ key, label }) => (
          <div key={key} className={styles.leaderRow}>
            <span className={styles.leaderLabel}>{label}</span>
            <div className={styles.leaderMatchup}>
              <div className={styles.leaderPlayer}>
                {leaders[key].away.headshot && (
                  <img src={leaders[key].away.headshot!} alt="" className={styles.leaderAvatar} width={28} height={28} />
                )}
                <span className={styles.leaderName}>{leaders[key].away.playerName.split(' ').pop()}</span>
                <span className={styles.leaderValue}>{leaders[key].away.value}</span>
              </div>
              <div className={styles.leaderPlayer}>
                <span className={styles.leaderValue}>{leaders[key].home.value}</span>
                <span className={styles.leaderName}>{leaders[key].home.playerName.split(' ').pop()}</span>
                {leaders[key].home.headshot && (
                  <img src={leaders[key].home.headshot!} alt="" className={styles.leaderAvatar} width={28} height={28} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamStatsSection({ teamStats, homeColor, awayColor }: { teamStats: GameTeamStatsComparison, homeColor: string, awayColor: string }) {
  const stats = [
    { label: 'AC%', home: teamStats.home.fieldGoalPct, away: teamStats.away.fieldGoalPct },
    { label: '3P%', home: teamStats.home.threePointPct, away: teamStats.away.threePointPct },
    { label: 'LL%', home: teamStats.home.freeThrowPct, away: teamStats.away.freeThrowPct },
    { label: 'Rebotes', home: teamStats.home.rebounds, away: teamStats.away.rebounds },
    { label: 'Assistências', home: teamStats.home.assists, away: teamStats.away.assists },
    { label: 'Roubos', home: teamStats.home.steals, away: teamStats.away.steals },
    { label: 'Tocos', home: teamStats.home.blocks, away: teamStats.away.blocks },
    { label: 'Erros', home: teamStats.home.turnovers, away: teamStats.away.turnovers },
  ];

  return (
    <div className={styles.section} style={{ '--home-color': homeColor, '--away-color': awayColor } as CSSProperties}>
      <h3 className={styles.sectionTitle}>Comparativo dos Times</h3>
      <div className={styles.statsGrid}>
        {stats.map(({ label, home, away }) => {
          const total = home + away || 1;
          const awayPct = (away / total) * 100;
          return (
            <div key={label} className={styles.statRow}>
              <span className={`${styles.statValue} ${away > home ? styles.statWin : ''}`}>{typeof away === 'number' && away % 1 !== 0 ? away.toFixed(1) : away}</span>
              <div className={styles.statBarContainer}>
                <span className={styles.statLabel}>{label}</span>
                <div className={styles.statBar}>
                  <div className={styles.statBarAway} style={{ width: `${awayPct}%` }} />
                </div>
              </div>
              <span className={`${styles.statValue} ${home > away ? styles.statWin : ''}`}>{typeof home === 'number' && home % 1 !== 0 ? home.toFixed(1) : home}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoxScoreSection({ playerStats }: { playerStats: GamePlayerStatsGroup }) {
  const renderTable = (group: { teamName: string; starters: any[]; bench: any[] }) => (
    <div className={styles.boxScoreTeam}>
      <h4 className={styles.boxScoreTeamName}>{group.teamName}</h4>
      <div className={styles.boxScoreTableWrapper}>
        <table className={styles.boxScoreTable}>
          <thead>
            <tr>
              <th className={styles.boxTh}>Jogador</th>
              <th className={styles.boxTh}>MIN</th>
              <th className={styles.boxTh}>PTS</th>
              <th className={styles.boxTh}>REB</th>
              <th className={styles.boxTh}>AST</th>
              <th className={styles.boxTh}>ROU</th>
              <th className={styles.boxTh}>TOC</th>
              <th className={styles.boxTh}>AC</th>
              <th className={styles.boxTh}>3P</th>
              <th className={styles.boxTh}>+/-</th>
            </tr>
          </thead>
          <tbody>
            {[...group.starters, ...group.bench].map((p) => (
              <tr key={p.playerId} className={p.starter ? styles.boxRowStarter : styles.boxRowBench}>
                <td className={styles.boxPlayerCell}>
                  <span className={styles.boxPlayerName}>{p.playerName}</span>
                  <span className={styles.boxPlayerPos}>{p.position}</span>
                </td>
                <td className={styles.boxTd}>{p.minutes}</td>
                <td className={`${styles.boxTd} ${styles.boxTdBold}`}>{p.points}</td>
                <td className={styles.boxTd}>{p.rebounds}</td>
                <td className={styles.boxTd}>{p.assists}</td>
                <td className={styles.boxTd}>{p.steals}</td>
                <td className={styles.boxTd}>{p.blocks}</td>
                <td className={styles.boxTd}>{p.fieldGoalsMade}-{p.fieldGoalsAttempted}</td>
                <td className={styles.boxTd}>{p.threePointMade}-{p.threePointAttempted}</td>
                <td className={`${styles.boxTd} ${(p.plusMinus ?? 0) > 0 ? styles.boxPositive : (p.plusMinus ?? 0) < 0 ? styles.boxNegative : ''}`}>
                  {p.plusMinus != null ? (p.plusMinus > 0 ? `+${p.plusMinus}` : p.plusMinus) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Box Score</h3>
      {renderTable(playerStats.away)}
      {renderTable(playerStats.home)}
    </div>
  );
}

function PlayByPlaySection({ plays }: { plays: GamePlayByPlayEvent[] }) {
  if (plays.length === 0) return null;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Lance a Lance</h3>
      <div className={styles.playsList}>
        {plays.slice(0, 30).map((play) => (
          <div
            key={play.id}
            className={`${styles.playItem} ${play.isScoring ? styles.playScoring : ''}`}
          >
            <div className={styles.playMeta}>
              <span className={styles.playPeriod}>Q{play.period}</span>
              <span className={styles.playClock}>{play.clock}</span>
            </div>
            <p className={styles.playText}>{play.description}</p>
            {play.isScoring && (
              <span className={styles.playScore}>
                {play.awayScore} - {play.homeScore}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page Component ──

type TabKey = 'resumo' | 'boxscore' | 'plays';

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.gameId as string;

  const [detail, setDetail] = useState<GameDetail | null>(null);
  const [plays, setPlays] = useState<GamePlayByPlayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('resumo');

  const loadDetail = useCallback(async () => {
    try {
      const [d, p] = await Promise.all([
        fetchGameDetail(gameId),
        fetchGamePlays(gameId, 100),
      ]);
      if (d) setDetail(d);
      if (p) setPlays(p);
    } catch (err) {
      console.error('Failed to load game detail:', err);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // Polling for live games
  useEffect(() => {
    if (!detail || detail.summary.status !== 'live') return;

    const interval = setInterval(() => {
      loadDetail();
    }, 15_000);

    return () => clearInterval(interval);
  }, [detail, loadDetail]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className="skeleton" style={{ height: 200, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 300, borderRadius: 14, marginTop: 16 }} />
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <span style={{ fontSize: 48 }}>😕</span>
            <p>Jogo não encontrado ou indisponível.</p>
            <Link href="/games" className={styles.backLink}>
              ← Voltar aos Jogos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLiveOrFinal = detail.summary.status === 'live' || detail.summary.status === 'final';

  const tabs: { key: TabKey; label: string }[] = isLiveOrFinal
    ? [
        { key: 'resumo', label: 'Resumo' },
        { key: 'boxscore', label: 'Estatísticas' },
        { key: 'plays', label: 'Lance a Lance' },
      ]
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        <Link href="/games" className={styles.backLink}>
          <ArrowLeft size={16} />
          Jogos
        </Link>

        {/* Score Header */}
        <LiveScoreHeader detail={detail} />

        {/* Tabs (only for live/final) */}
        {tabs.length > 0 && (
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        {isLiveOrFinal && activeTab === 'resumo' && (
          <>
            {detail.leaders && <GameLeadersSection leaders={detail.leaders} />}
            {detail.teamStats && <TeamStatsSection teamStats={detail.teamStats} homeColor={detail.summary.homeTeam.colors.primary} awayColor={detail.summary.awayTeam.colors.primary} />}
          </>
        )}

        {isLiveOrFinal && activeTab === 'boxscore' && detail.playerStats && (
          <BoxScoreSection playerStats={detail.playerStats} />
        )}

        {isLiveOrFinal && activeTab === 'plays' && (
          <PlayByPlaySection plays={plays} />
        )}

        {/* Pre-game preview */}
        {detail.summary.status === 'scheduled' && detail.preview && (
          <>
            {/* Recent Form */}
            {(detail.preview.homeRecentForm.length > 0 || detail.preview.awayRecentForm.length > 0) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Últimos Jogos</h3>
                <div className={styles.recentFormGrid}>
                  <div className={styles.recentFormTeam}>
                    <span className={styles.recentFormLabel}>{detail.summary.awayTeam.abbreviation}</span>
                    <div className={styles.recentFormPills}>
                      {detail.preview.awayRecentForm.map((g, i) => (
                        <span key={i} className={`${styles.resultPill} ${g.result === 'W' ? styles.pillWin : styles.pillLoss}`}>
                          {g.result}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.recentFormTeam}>
                    <span className={styles.recentFormLabel}>{detail.summary.homeTeam.abbreviation}</span>
                    <div className={styles.recentFormPills}>
                      {detail.preview.homeRecentForm.map((g, i) => (
                        <span key={i} className={`${styles.resultPill} ${g.result === 'W' ? styles.pillWin : styles.pillLoss}`}>
                          {g.result}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Head to Head */}
            {detail.preview.headToHead.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Últimos Confrontos</h3>
                <div className={styles.h2hList}>
                  {detail.preview.headToHead.map((h, i) => (
                    <div key={i} className={styles.h2hItem}>
                      <span className={styles.h2hDate}>
                        {new Date(h.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className={styles.h2hScore}>
                        {h.homeScore} - {h.awayScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Live auto-update notice */}
        {detail.summary.status === 'live' && (
          <div className={styles.liveNotice}>
            <span className={styles.liveNoticeDot} />
            Atualizando a cada 15 segundos
          </div>
        )}
      </div>
    </div>
  );
}
