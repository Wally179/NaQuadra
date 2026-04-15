import { ScoreboardBar } from '@/components/features/scoreboard/ScoreboardBar/ScoreboardBar';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import { MOCK_GAMES } from '@/data/mock-games';
import { MOCK_ARTICLES } from '@/data/mock-articles';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const featuredArticle = MOCK_ARTICLES[0];
  const restArticles = MOCK_ARTICLES.slice(1);

  return (
    <>
      {/* === SCOREBOARD BAR === */}
      <section className={styles.heroSection}>
        <ScoreboardBar games={MOCK_GAMES} />
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
