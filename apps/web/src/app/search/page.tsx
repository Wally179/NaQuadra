import { fetchSearchPlayer, fetchNews } from '@/lib/api';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import styles from './page.module.css';
import Link from 'next/link';

interface PageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query = '' } = await searchParams;
  
  const searchForm = (
    <form action="/search" method="GET" className={styles.searchBar}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Busque por jogadores, times ou notícias..."
        className={styles.searchInput}
        autoFocus={!query}
      />
    </form>
  );

  if (!query) {
    return (
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Buscar no Na Quadra</h1>
        {searchForm}
        <div className={styles.emptyState}>
          <p>Digite o nome de um jogador, time ou assunto para buscar.</p>
        </div>
      </main>
    );
  }

  // Fetch player match
  const player = await fetchSearchPlayer(query);
  
  // Fetch related news
  const allNews = await fetchNews({ revalidate: 0 }); // Bypass cache for search
  
  // Perform weak text searching over headlines and content
  const lowerQuery = query.toLowerCase();
  const relatedNews = allNews.filter(
    (n) => n.title.toLowerCase().includes(lowerQuery) || (n.summary ?? '').toLowerCase().includes(lowerQuery)
  ).slice(0, 4);

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Resultados da busca</h1>
      {searchForm}

      {player && (
        <section className={styles.playerSection}>
          <h2 className={styles.sectionTitle}>Jogadores:</h2>
          
          <div className={styles.playerCardContainer}>
            <div className={styles.playerCard}>
              <div className={styles.playerHeadshotWrapper}>
                {player.headshot ? (
                  <img src={player.headshot} alt={player.name} className={styles.playerHeadshot} />
                ) : (
                  <div className={styles.playerHeadshotPlaceholder}>🏀</div>
                )}
              </div>
              <div className={styles.playerInfo}>
                <h3 className={styles.playerName}>{player.name}</h3>
                <p className={styles.playerTeam}>{(player.teamId ?? player.teamAbbr ?? '').toUpperCase()} • #{player.jersey} • {player.position}</p>
                <div className={styles.playerStats}>
                  <span>Altura: {player.height}</span>
                  <span>Peso: {player.weight}</span>
                </div>
                <Link href={`/players/${player.externalId}`} className={styles.playerLink}>
                  Detalhes
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedNews.length > 0 && (
        <section className={styles.newsSection}>
          <h2 className={styles.sectionTitle}>Notícias:</h2>
          <div className={styles.newsGrid}>
            {relatedNews.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {!player && relatedNews.length === 0 && (
        <div className={styles.emptyState}>
          <p>Nenhum resultado encontrado para "{query}".</p>
        </div>
      )}
    </main>
  );
}
