import { fetchSearchPlayer, fetchNews } from '@/lib/api';
import { ArticleCard } from '@/components/features/news/ArticleCard/ArticleCard';
import { EntityCard } from '@/components/ui/EntityCard/EntityCard';
import { getAllTeams, getTeamColors } from '@/data/teams';
import styles from './page.module.css';
import Link from 'next/link';

interface PageProps {
  searchParams: { q?: string };
}

function formatHeight(usHeight: string): string {
  if (!usHeight) return '-';
  const match = usHeight.match(/(\d+)'\s*(\d+)"?/);
  if (match) {
    const feet = parseInt(match[1], 10);
    const inches = parseInt(match[2], 10);
    const cm = Math.round((feet * 12 + inches) * 2.54);
    const m = (cm / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${m} M (${usHeight})`;
  }
  return usHeight;
}

function formatWeight(usWeight: string): string {
  if (!usWeight) return '-';
  const match = usWeight.match(/(\d+)\s*lbs?/i);
  if (match) {
    const lbs = parseInt(match[1], 10);
    const kg = Math.round(lbs * 0.453592);
    return `${kg} KG (${usWeight})`;
  }
  return usWeight;
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

  const lowerQuery = query.toLowerCase();

  // Fetch player match
  const player = await fetchSearchPlayer(query, { revalidate: 0 });
  
  // Find team matches
  const allTeams = getAllTeams();
  const matchedTeams = allTeams.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) || 
    t.city.toLowerCase().includes(lowerQuery) ||
    t.abbreviation.toLowerCase().includes(lowerQuery)
  );
  
  // Fetch related news
  const allNews = await fetchNews({ revalidate: 0 }); // Bypass cache for search
  const relatedNews = allNews.filter(
    (n) => n.title.toLowerCase().includes(lowerQuery) || (n.summary ?? '').toLowerCase().includes(lowerQuery)
  ).slice(0, 4);

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>Resultados da busca</h1>
      {searchForm}

      {matchedTeams.length > 0 && (
        <section className={styles.playerSection}>
          <h2 className={styles.sectionTitle}>Times:</h2>
          <div className={styles.playerCardContainer}>
            {matchedTeams.map((team) => (
              <EntityCard
                key={team.id}
                href={`/teams/${team.id}`}
                color={team.colors.primary}
                imageSrc={team.logo}
                imageAlt={team.name}
                type="team"
                title={team.name}
                subtitle={`${team.conference === 'east' ? 'Leste' : 'Oeste'} - Divisão ${
                  team.division === 'Atlantic' ? 'do Atlântico' :
                  team.division === 'Central' ? 'Central' :
                  team.division === 'Southeast' ? 'Sudeste' :
                  team.division === 'Northwest' ? 'Noroeste' :
                  team.division === 'Pacific' ? 'do Pacífico' :
                  team.division === 'Southwest' ? 'Sudoeste' : team.division
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {player && (
        <section className={styles.playerSection}>
          <h2 className={styles.sectionTitle}>Jogadores:</h2>
          
          <div className={styles.playerCardContainer}>
            <EntityCard 
              href={`/players/${player.externalId}`}
              color={getTeamColors(player.teamId || player.teamAbbr || '')?.primary}
              imageSrc={player.headshot}
              imageAlt={player.name}
              type="player"
              title={player.name}
              subtitle={
                <>
                  {player.teamName || (player.teamId ?? player.teamAbbr ?? '').toUpperCase()} - #{player.jersey} - {
                    player.position === 'F' ? 'Ala' :
                    player.position === 'G' ? 'Armador' :
                    player.position === 'C' ? 'Pivô' :
                    player.position === 'SF' ? 'Ala' :
                    player.position === 'PF' ? 'Ala-Pivô' :
                    player.position === 'PG' ? 'Armador' :
                    player.position === 'SG' ? 'Ala-Armador' :
                    player.position
                  }
                </>
              }
              details={
                <>
                  <span>Altura: {formatHeight(player.height)}</span>
                  <span>Peso: {formatWeight(player.weight)}</span>
                </>
              }
            />
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

      {!player && matchedTeams.length === 0 && relatedNews.length === 0 && (
        <div className={styles.emptyState}>
          <p>Nenhum resultado encontrado para "{query}".</p>
        </div>
      )}
    </main>
  );
}
