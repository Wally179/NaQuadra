'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import styles from './PlayerSearch.module.css';

// Using a simplified mock type since we don't have a players endpoint yet
interface MockPlayer {
  id: string;
  name: string;
  team: string;
  headshot: string;
}

const MOCK_PLAYERS: MockPlayer[] = [
  { id: '2544', name: 'LeBron James', team: 'LAL', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/2544.png' },
  { id: '3975', name: 'Stephen Curry', team: 'GSW', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3975.png' },
  { id: '3992', name: 'James Harden', team: 'LAC', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3992.png' },
  { id: '6442', name: 'Kyrie Irving', team: 'DAL', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/6442.png' },
  { id: '110', name: 'Kobe Bryant', team: 'LAL', headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/110.png' },
];

interface PlayerSearchProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function PlayerSearch({ selectedIds, onChange }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MockPlayer[]>([]);
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

  // Mock search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = MOCK_PLAYERS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) && 
        !selectedIds.includes(p.id)
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedIds]);

  const handleSelect = (player: MockPlayer) => {
    if (!selectedIds.includes(player.id)) {
      onChange([...selectedIds, player.id]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter(pid => pid !== id));
  };

  const selectedPlayers = selectedIds.map(id => MOCK_PLAYERS.find(p => p.id === id)).filter(Boolean) as MockPlayer[];

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.chips}>
        {selectedPlayers.map(player => (
          <div key={player.id} className={styles.chip}>
            <div className={styles.chipAvatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={player.headshot} alt={player.name} />
            </div>
            <span className={styles.chipName}>{player.name}</span>
            <button type="button" className={styles.chipRemove} onClick={() => handleRemove(player.id)}>
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
              <div key={player.id} className={styles.resultItem} onClick={() => handleSelect(player)}>
                <div className={styles.resultAvatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={player.headshot} alt={player.name} />
                </div>
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{player.name}</span>
                  <span className={styles.resultTeam}>{player.team}</span>
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
