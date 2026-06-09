'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { getAllTeams } from '@/data/teams';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import styles from '../page.module.css';

export function PersonalizedContent() {
  const { isAuthenticated, user, onboardingCompleted } = useAuthStore();

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

  return (
    <>
      {favoriteTeam && (
        <section className={styles.personalizedSection} style={{ backgroundColor: favoriteTeam.colors.primary, borderRadius: '16px', padding: '32px', marginBottom: '32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, pointerEvents: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={favoriteTeam.logo} alt="" style={{ width: '300px', height: '300px' }} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={favoriteTeam.logo} alt={favoriteTeam.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Seu Time</span>
              <h2 style={{ fontSize: '32px', margin: '4px 0 8px 0', fontWeight: 800 }}>{favoriteTeam.name}</h2>
              <Link href={`/teams/${favoriteTeam.slug}`} style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500 }}>
                Ver página do time <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {user.favoritePlayerIds && user.favoritePlayerIds.length > 0 && (
        <section className={styles.personalizedSection} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Star size={20} color="var(--nq-brand-primary)" />
            <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--nq-text-primary)' }}>Seus Jogadores</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {user.favoritePlayerIds.map(playerId => (
              <div key={playerId} style={{ minWidth: '200px', backgroundColor: 'var(--nq-bg-secondary)', border: '1px solid var(--nq-border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--nq-bg-tertiary)', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://a.espncdn.com/i/headshots/nba/players/full/${playerId}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://a.espncdn.com/i/headshots/nba/players/full/fallback.png' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '12px', width: '80%', backgroundColor: 'var(--nq-bg-tertiary)', borderRadius: '4px', marginBottom: '6px' }}></div>
                  <div style={{ height: '10px', width: '50%', backgroundColor: 'var(--nq-bg-tertiary)', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
