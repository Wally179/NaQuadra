import { Suspense } from 'react';
import { fetchNewsArticle, fetchNews } from '@/lib/api';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import { ArticleCardSkeleton } from '@/components/features/news/ArticleCard/ArticleCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './NewsArticlePage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);
  if (!article) return { title: 'Notícia não encontrada' };
  return {
    title: `${article.title} | Na Quadra`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

// ── Related News Section (streamed via Suspense) ──
async function RelatedNewsSection({ currentArticleId }: { currentArticleId: string }) {
  const allNews = await fetchNews({ revalidate: 3600 });
  const relatedNews = allNews.filter((n) => n.id !== currentArticleId).slice(0, 3);

  if (relatedNews.length === 0) return null;

  return (
    <section className={styles.relatedSection}>
      <div className={styles.relatedHeader}>
        <h2>Notícias Relacionadas</h2>
        <Link href="/news" className={styles.viewAll}>Ver todas</Link>
      </div>
      <div className={styles.relatedGrid}>
        {relatedNews.map((n) => (
          <ArticleCard key={n.id} article={n} />
        ))}
      </div>
    </section>
  );
}

// ── Related News Skeleton ──
function RelatedNewsSkeleton() {
  return (
    <section className={styles.relatedSection} aria-hidden="true">
      <div className={styles.relatedHeader}>
        <Skeleton width={200} height={24} />
        <Skeleton width={80} height={16} />
      </div>
      <div className={styles.relatedGrid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);
  
  if (!article) {
    notFound();
  }

  return (
    <main className={styles.main}>
      {/* Article content renders immediately */}
      <article className={styles.articleContainer}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
            <span className={styles.readTime}>• {article.readTimeMinutes || 3} min de leitura</span>
          </div>
          
          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.subtitle}>{article.summary}</p>
          
          <div className={styles.authorSection}>
            <div className={styles.authorAvatar}>🏀</div>
            <span className={styles.authorName}>Por {article.author?.name || 'ESPN'}</span>
          </div>
        </header>

        {article.coverImage && (
          <div className={styles.imageWrapper}>
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className={styles.image}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              unoptimized={!article.coverImage.startsWith('https://a.espncdn.com')}
            />
          </div>
        )}

        <div className={styles.content}>
          <p>{article.content}</p>
          <a href={article.link || article.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceButton}>
            Ler matéria completa em {article.author?.name || 'ESPN'} ↗
          </a>
        </div>
      </article>

      {/* Related news streams independently */}
      <Suspense fallback={<RelatedNewsSkeleton />}>
        <RelatedNewsSection currentArticleId={article.id} />
      </Suspense>
    </main>
  );
}
