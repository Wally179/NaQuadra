'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { getAllTeams } from '@/data/teams';
import { getContrastYIQ } from '@/lib/colors';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import styles from '../page.module.css';

export function PersonalizedTeam() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) return null;

  const favoriteTeam = user.favoriteTeamId 
    ? getAllTeams().find(t => t.id === user.favoriteTeamId) 
    : null;

  if (!favoriteTeam && !user.favoritePlayerIds?.length) {
    // Show prompt to customize
    return (
      <section className={styles.personalizedSection} style={{ backgroundColor: 'var(--nq-bg-secondary)', border: '1px solid var(--nq-border-subtle)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--nq-text-primary)' }}>Bem-vindo, {user.name.split(' ')[0]}!</h2>
            <p style={{ margin: 0, color: 'var(--nq-text-secondary)', fontSize: '14px' }}>Personalize sua experiência escolhendo seu time e jogadores favoritos.</p>
          </div>
          <Link href="/onboarding" style={{ backgroundColor: 'var(--nq-brand-primary)', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>
            Personalizar Agora
          </Link>
        </div>
      </section>
    );
  }

  if (!favoriteTeam) return null;

  const textColor = favoriteTeam ? getContrastYIQ(favoriteTeam.colors.primary) : '#fff';
  const isLightText = textColor === 'white';
  const logoBgColor = isLightText ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)';

  return (
    <section className={styles.personalizedSection} style={{ backgroundColor: favoriteTeam.colors.primary, borderRadius: '16px', padding: '32px', marginBottom: '32px', color: textColor, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: isLightText ? 0.1 : 0.05, pointerEvents: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={favoriteTeam.logo} alt="" style={{ width: '300px', height: '300px', filter: isLightText ? 'none' : 'invert(1)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: logoBgColor, borderRadius: '50%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={favoriteTeam.logo} alt={favoriteTeam.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Seu Time</span>
          <h2 style={{ fontSize: '32px', margin: '4px 0 8px 0', fontWeight: 800, color: textColor }}>{favoriteTeam.name}</h2>
          <Link href={`/teams/${favoriteTeam.id}`} style={{ color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500 }}>
            Ver página do time <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { fetchPlayerDetail, PlayerDetail } from '@/lib/api';

export function PersonalizedPlayers() {
  const { isAuthenticated, user } = useAuthStore();
  const [players, setPlayers] = useState<PlayerDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.favoritePlayerIds?.length) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const details = await Promise.all(
        user!.favoritePlayerIds!.map(id => fetchPlayerDetail(id))
      );
      setPlayers(details.filter(Boolean) as PlayerDetail[]);
      setLoading(false);
    }
    load();
  }, [user?.favoritePlayerIds]);

  if (!isAuthenticated || !user) return null;

  if (!user.favoritePlayerIds || user.favoritePlayerIds.length === 0) return null;

  return (
    <section className={styles.personalizedSection} style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Star size={20} color="var(--nq-brand-primary)" />
        <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--nq-text-primary)' }}>Seus Jogadores</h2>
      </div>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {loading ? (
          user.favoritePlayerIds.map(playerId => (
            <div key={playerId} style={{ minWidth: '200px', backgroundColor: 'var(--nq-bg-secondary)', border: '1px solid var(--nq-border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--nq-bg-tertiary)', overflow: 'hidden', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://a.espncdn.com/i/headshots/nba/players/full/${playerId}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://a.espncdn.com/i/headshots/nba/players/full/fallback.png' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '12px', width: '80%', backgroundColor: 'var(--nq-bg-tertiary)', borderRadius: '4px', margin: '0 0 6px 0' }}></div>
                <div style={{ height: '10px', width: '50%', backgroundColor: 'var(--nq-bg-tertiary)', borderRadius: '4px', margin: '0' }}></div>
              </div>
            </div>
          ))
        ) : (
          players.map(player => (
            <div key={player.externalId} style={{ minWidth: '200px', backgroundColor: 'var(--nq-bg-secondary)', border: '1px solid var(--nq-border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--nq-bg-tertiary)', overflow: 'hidden', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={player.headshot} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://a.espncdn.com/i/headshots/nba/players/full/fallback.png' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--nq-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--nq-text-secondary)', fontWeight: 500 }}>{player.teamAbbr} - #{player.jersey}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
