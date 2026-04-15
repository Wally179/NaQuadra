'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { getAllTeams } from '@/data/teams';
import { MOCK_PLAYERS } from '@/data/mock-players';
import { MOCK_ARTICLES } from '@/data/mock-articles';
import styles from './page.module.css';

type ResultType = 'team' | 'player' | 'article';
type FilterType = 'all' | ResultType;

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'team', label: 'Times' },
  { key: 'player', label: 'Jogadores' },
  { key: 'article', label: 'Artigos' },
];

const SUGGESTIONS = ['LeBron', 'Celtics', 'Lakers', 'Playoffs', 'Wembanyama', 'Thunder'];

interface SearchResult {
  id: string;
  type: ResultType;
  name: string;
  meta: string;
  href: string;
  logo?: string;
  emoji?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const allTeams = getAllTeams();

  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    if (filter === 'all' || filter === 'team') {
      allTeams
        .filter((t) => t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.abbreviation.toLowerCase().includes(q))
        .slice(0, 5)
        .forEach((t) => results.push({
          id: t.id,
          type: 'team',
          name: t.name,
          meta: `${t.conference === 'east' ? 'Leste' : 'Oeste'} · ${t.division}`,
          href: `/teams/${t.id}`,
          logo: t.logo,
        }));
    }

    if (filter === 'all' || filter === 'player') {
      MOCK_PLAYERS
        .filter((p) => p.name.toLowerCase().includes(q))
        .slice(0, 5)
        .forEach((p) => results.push({
          id: p.id,
          type: 'player',
          name: p.name,
          meta: `${p.position} · ${allTeams.find((t) => t.id === p.teamId)?.name ?? ''}`,
          href: `/players/${p.id}`,
          emoji: '🏀',
        }));
    }

    if (filter === 'all' || filter === 'article') {
      MOCK_ARTICLES
        .filter((a) => a.title.toLowerCase().includes(q) || a.subtitle?.toLowerCase().includes(q))
        .slice(0, 5)
        .forEach((a) => results.push({
          id: a.id,
          type: 'article',
          name: a.title,
          meta: a.author.name,
          href: `/news/${a.id}`,
          emoji: '📰',
        }));
    }

    return results;
  }, [query, filter, allTeams]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Buscar</h1>

      {/* Search input */}
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Times, jogadores, notícias..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          aria-label="Buscar no Na Quadra"
        />
      </div>

      {/* Type filters */}
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filter} ${filter === f.key ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.key)}
            type="button"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results or empty state */}
      {query.trim() === '' ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <h2 className={styles.emptyTitle}>Pesquise times, jogadores e notícias</h2>
          <p className={styles.emptyText}>Digite ao menos 1 letra para começar</p>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className={styles.suggestion}
                onClick={() => setQuery(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>😞</div>
          <h2 className={styles.emptyTitle}>Nenhum resultado para "{query}"</h2>
          <p className={styles.emptyText}>Tente outro termo ou verifique a ortografia</p>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </p>
          <div className={styles.results}>
            {results.map((item) => (
              <Link key={`${item.type}-${item.id}`} href={item.href} className={styles.resultItem}>
                <div className={styles.resultIcon}>
                  {item.logo ? (
                    <img src={item.logo} alt="" className={styles.resultLogo} width={32} height={32} loading="lazy" />
                  ) : (
                    <span style={{ fontSize: '1.25rem' }}>{item.emoji}</span>
                  )}
                </div>
                <div className={styles.resultInfo}>
                  <div className={styles.resultName}>{item.name}</div>
                  <div className={styles.resultMeta}>{item.meta}</div>
                </div>
                <span className={`${styles.resultType} ${
                  item.type === 'team' ? styles.typeTeam :
                  item.type === 'player' ? styles.typePlayer : styles.typeArticle
                }`}>
                  {item.type === 'team' ? 'Time' : item.type === 'player' ? 'Jogador' : 'Artigo'}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
