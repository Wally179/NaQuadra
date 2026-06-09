'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { fetchSearchPlayer, fetchPlayerDetail, PlayerDetail } from '@/lib/api';
import styles from './PlayerSearch.module.css';

interface PlayerSearchProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function PlayerSearch({ selectedIds, onChange }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerDetail[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerDetail[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load details for selected chips
  useEffect(() => {
    async function loadSelected() {
      const details = await Promise.all(
        selectedIds.map(id => fetchPlayerDetail(id))
      );
      setSelectedPlayers(details.filter(Boolean) as PlayerDetail[]);
    }
    loadSelected();
  }, [selectedIds]);

  // Real API search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const player = await fetchSearchPlayer(query);
      if (player && !selectedIds.includes(player.externalId)) {
        setResults([player]);
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, selectedIds]);

  const handleSelect = (player: PlayerDetail) => {
    if (!selectedIds.includes(player.externalId)) {
      onChange([...selectedIds, player.externalId]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter(pid => pid !== id));
  };

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.chips}>
        {selectedPlayers.map(player => (
          <div key={player.externalId} className={styles.chip}>
            <div className={styles.chipAvatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={player.headshot} alt={player.name} onError={(e) => { e.currentTarget.src = 'https://a.espncdn.com/i/headshots/nba/players/full/fallback.png' }} />
            </div>
            <span className={styles.chipName}>{player.name}</span>
            <button type="button" className={styles.chipRemove} onClick={() => handleRemove(player.externalId)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.input}
          placeholder="Buscar jogador..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isSearching && <Loader2 size={18} className={styles.spinner} />}
      </div>

      {isOpen && query.trim() && (
        <div className={styles.dropdown}>
          {results.length > 0 ? (
            results.map(player => (
              <div key={player.externalId} className={styles.resultItem} onClick={() => handleSelect(player)}>
                <div className={styles.resultAvatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={player.headshot} alt={player.name} onError={(e) => { e.currentTarget.src = 'https://a.espncdn.com/i/headshots/nba/players/full/fallback.png' }} />
                </div>
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{player.name}</span>
                  <span className={styles.resultTeam}>{player.teamAbbr} - #{player.jersey}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              {isSearching ? 'Buscando...' : 'Nenhum jogador encontrado.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
