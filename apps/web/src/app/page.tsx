import { ScoreboardBar } from '@/components/features/scoreboard/ScoreboardBar/ScoreboardBar';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import { fetchScoreboard, fetchNews, type ScoreboardGame } from '@/lib/api';
import { MOCK_GAMES } from '@/data/mock-games';
import { MOCK_ARTICLES } from '@/data/mock-articles';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { addDays, format } from 'date-fns';
import type { NormalizedGame } from '@naquadra/types';
import styles from './page.module.css';

/** Map API scoreboard data to the NormalizedGame format the GameCard expects */
function mapToNormalizedGame(game: ScoreboardGame): NormalizedGame {
  return {
    externalId: game.externalId,
    date: game.date,
    startTime: game.startTime,
    status: game.status as NormalizedGame['status'],
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
    homeRecord: game.homeRecord,
    awayRecord: game.awayRecord,
    quarter: game.quarter,
    clock: game.clock,
    conference: '',
    phase: 'regular',
    seriesInfo: game.seriesInfo,
    venue: game.venue,
    broadcast: game.broadcast,
    lastUpdated: new Date().toISOString(),
  };
}

export default async function HomePage() {
  // Fetch real scoreboard from API (server-side, with ISR revalidation)
  let games: NormalizedGame[] = [];
  try {
    const today = new Date();
    let currentDay = 1;
    
    // Fetch future games up to 7 days ahead until we have at least 3
    while (currentDay <= 7 && games.length < 3) {
      const targetDate = addDays(today, currentDay);
      const dateStr = format(targetDate, 'yyyyMMdd');
      
      const apiGames = await fetchScoreboard(dateStr);
      if (apiGames && apiGames.length > 0) {
        games.push(...apiGames.map(mapToNormalizedGame));
      }
      currentDay++;
    }
  } catch {
    // If error, games will remain empty
  }

  // If we couldn't find at least 3 games in the next 7 days, don't show any.
  if (games.length < 3) {
    games = [];
  }

  // Fetch real news from API
  let articles = await fetchNews({ revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600, tags: ['news'] });
  if (!articles || articles.length === 0) {
    articles = MOCK_ARTICLES;
  }

  const featuredArticle = articles[0];
  const restArticles = articles.slice(1, 5); // Display 4 articles in the grid, making 5 total with the featured one

  return (
    <>
      {/* === SCOREBOARD BAR === */}
      <section className={styles.heroSection}>
        <ScoreboardBar games={games} />
      </section>

      {/* === NEWS FEED === */}
      <section className={styles.newsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Últimas Notícias</h2>
          <Link href="/news" className={styles.sectionLink}>
            Ver todas →
          </Link>
        </div>

        <div className={styles.articlesGrid}>
          {/* Featured article (spans full width) */}
          {featuredArticle && (
            <ArticleCard article={featuredArticle} featured />
          )}

          {/* Rest of articles */}
          {restArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* === EDU BLOCK: "Entenda em 20 segundos" === */}
      <section className={styles.eduSection}>
        <div className={styles.eduCard}>
          <span className={styles.eduBadge}>
            <BookOpen size={14} />
            Entenda em 20 segundos
          </span>
          <h3 className={styles.eduTitle}>O que são os Playoffs da NBA?</h3>
          <p className={styles.eduText}>
            Os Playoffs são a fase eliminatória da NBA. Após a temporada regular (82 jogos),
            os 6 melhores times de cada conferência (Leste e Oeste) se classificam diretamente.
            Os times entre 7º e 10º disputam o Play-In para as últimas duas vagas.
            As séries são disputadas em melhor de 7 jogos, até as Finais da NBA.
          </p>
          <Link href="/glossary" className={styles.eduLink}>
            Explorar o Glossário NBA <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          <span className={styles.footerBrand}>🏀 Na Quadra</span>
          {' '} — Entenda a NBA. Acompanhe seus times. Viva a quadra.
        </p>
      </footer>
    </>
  );
}

