import { fetchNewsArticle, fetchNews } from '@/lib/api';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import styles from './NewsArticlePage.module.css';
import Link from 'next/link';
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

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchNewsArticle(slug);
  
  if (!article) {
    notFound();
  }

  // Fetch some related news (falling back to generic news for now)
  const allNews = await fetchNews({ revalidate: 3600 });
  const relatedNews = allNews.filter((n) => n.id !== article.id).slice(0, 3);

  return (
    <main className={styles.main}>
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
            <img src={article.coverImage} alt={article.title} className={styles.image} />
          </div>
        )}

        <div className={styles.content}>
          <p>{article.content}</p>
          <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
            Ler matéria completa na ESPN ↗
          </a>
        </div>
      </article>

      {relatedNews.length > 0 && (
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
      )}
    </main>
  );
}
