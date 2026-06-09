'use client';

import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllTeams } from '@/data/teams';
import { getContrastYIQ } from '@/lib/colors';
import styles from './TeamSelector.module.css';

interface TeamSelectorProps {
  value: string | string[]; // string for single, string[] for multiple
  onChange: (value: any) => void;
  multiple?: boolean;
}

export function TeamSelector({ value, onChange, multiple = false }: TeamSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const teams = getAllTeams();

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.abbreviation.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (teamId: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(teamId);
    }
    return value === teamId;
  };

  const handleSelect = (teamId: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(teamId)) {
        onChange(current.filter((id) => id !== teamId));
      } else {
        onChange([...current, teamId]);
      }
    } else {
      onChange(teamId === value ? null : teamId);
    }
  };

  const selectedTeams = teams.filter((t) => isSelected(t.id));

  return (
    <div className={styles.container}>
      {/* Drawer Header / Selected Items Preview */}
      <div 
        className={styles.drawerHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedPreview}>
          {selectedTeams.length > 0 ? (
            <div className={styles.previewChips}>
              {selectedTeams.map(t => (
                <div key={t.id} className={styles.previewChip} style={{ backgroundColor: t.colors.primary, color: getContrastYIQ(t.colors.primary) }}>
                  <img src={t.logo} alt="" className={styles.previewLogo} />
                  <span>{t.abbreviation}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className={styles.placeholder}>Selecione seu time...</span>
          )}
        </div>
        <button className={styles.toggleBtn}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className={styles.drawerContent}>
          <input
            type="text"
            placeholder="Buscar time..."
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <div className={styles.grid}>
            {filteredTeams.map((team) => {
              const selected = isSelected(team.id);
              return (
                <div
                  key={team.id}
                  className={`${styles.teamCard} ${selected ? styles.selected : ''}`}
                  style={{
                    backgroundColor: selected ? team.colors.primary : undefined,
                    borderColor: selected ? team.colors.primary : 'transparent',
                    boxShadow: selected ? `0 0 10px ${team.colors.primary}40` : 'none',
                    color: selected ? getContrastYIQ(team.colors.primary) : undefined,
                  }}
                  onClick={() => handleSelect(team.id)}
                >
                  {selected && (
                    <div className={styles.badge}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <div className={styles.logoWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={team.logo} alt={team.name} className={styles.logo} loading="lazy" />
                  </div>
                  <span className={styles.name} style={{ color: selected ? getContrastYIQ(team.colors.primary) : undefined }}>
                    {team.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
