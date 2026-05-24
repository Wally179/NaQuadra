'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { MOCK_GLOSSARY } from '@/data/mock-glossary';
import type { GlossaryCategory } from '@naquadra/types';
import styles from './page.module.css';

const CATEGORIES: { key: GlossaryCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'competition', label: 'Competição' },
  { key: 'positions', label: 'Posições' },
  { key: 'stats', label: 'Estatísticas' },
  { key: 'plays', label: 'Jogadas' },
  { key: 'rules', label: 'Regras' },
  { key: 'culture', label: 'Cultura' },
];

const CATEGORY_STYLES: Record<string, string> = {
  competition: styles.catCompetition,
  positions: styles.catPositions,
  stats: styles.catStats,
  plays: styles.catPlays,
  rules: styles.catRules,
  culture: styles.catCulture,
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: styles.diffBeginner,
  intermediate: styles.diffIntermediate,
  advanced: styles.diffAdvanced,
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '● Iniciante',
  intermediate: '● Intermediário',
  advanced: '● Avançado',
};

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return MOCK_GLOSSARY.filter((entry) => {
      const searchNormalized = search.toLowerCase().replace(/-/g, ' ');
      const termNormalized = entry.term.toLowerCase().replace(/-/g, ' ');
      const slugNormalized = entry.slug.toLowerCase().replace(/-/g, ' ');
      
      const matchesSearch =
        search === '' ||
        termNormalized.includes(searchNormalized) ||
        slugNormalized.includes(searchNormalized) ||
        entry.shortDefinition.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === 'all' || entry.category === activeCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  const handleRelatedClick = (slug: string) => {
    setSearch(slug.replace(/-/g, ' '));
    setActiveCategory('all');
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <BookOpen size={28} className={styles.titleIcon} />
          Glossário NBA
        </h1>
        <p className={styles.subtitle}>
          Entenda os termos, siglas e conceitos do basquete profissional.
          Do iniciante ao avançado — sem enrolação.
        </p>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar termos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar no glossário"
        />
      </div>

      {/* Category filters */}
      <div className={styles.filters} role="tablist">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat.key)}
            role="tab"
            aria-selected={activeCategory === cat.key}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'termo encontrado' : 'termos encontrados'}
      </p>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>Nenhum termo encontrado. Tente outra busca.</p>
        </div>
      ) : (
        <div className={styles.entries}>
          {filtered.map((entry) => (
            <article key={entry.id} className={styles.entry} id={entry.slug}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTerm}>{entry.term}</h3>
                <span className={`${styles.entryCategory} ${CATEGORY_STYLES[entry.category] || ''}`}>
                  {entry.category}
                </span>
                <span className={`${styles.entryDifficulty} ${DIFFICULTY_STYLES[entry.difficulty] || ''}`}>
                  {DIFFICULTY_LABELS[entry.difficulty]}
                </span>
              </div>
              <p className={styles.entryDefinition}>{entry.shortDefinition}</p>
              {entry.relatedTerms.length > 0 && (
                <div className={styles.relatedTerms}>
                  {entry.relatedTerms.map((slug) => (
                    <button
                      key={slug}
                      className={styles.relatedTag}
                      onClick={() => handleRelatedClick(slug)}
                      type="button"
                    >
                      {slug.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
