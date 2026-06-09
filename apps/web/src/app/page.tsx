import { Suspense } from 'react';
import { ScoreboardBarSkeleton } from '@/components/features/scoreboard/ScoreboardBar/ScoreboardBarSkeleton';
import { ScoreboardSection } from './_sections/ScoreboardSection';
import { NewsSection } from './_sections/NewsSection';
import { NewsSectionSkeleton } from './_sections/NewsSectionSkeleton';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

import { PersonalizedContent } from './_sections/PersonalizedContent';

// ============================================================
// Na Quadra — Home Page (Progressive Loading)
// ============================================================
// Each section loads independently via Suspense streaming.
// The page shell renders instantly while data loads in background.
// ============================================================

export default function HomePage() {
  return (
    <>
      <PersonalizedContent />

      {/* === SCOREBOARD BAR === */}
      {/* Streams independently — shows skeleton while fetching games */}
      <section className={styles.heroSection}>
        <Suspense fallback={<ScoreboardBarSkeleton />}>
          <ScoreboardSection />
        </Suspense>
      </section>

      {/* === NEWS FEED === */}
      {/* Streams independently — shows article skeletons while fetching news */}
      <Suspense fallback={<NewsSectionSkeleton />}>
        <NewsSection />
      </Suspense>

      {/* === EDU BLOCK: "Entenda em 20 segundos" === */}
      {/* Renders immediately — no data dependency */}
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
    </>
  );
}
