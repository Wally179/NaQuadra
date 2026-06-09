'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, LogOut, Loader2, Save } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { authFetch } from '@/lib/api-auth';
import { TeamSelector } from '@/components/features/profile/TeamSelector/TeamSelector';
import { PlayerSearch } from '@/components/features/profile/PlayerSearch/PlayerSearch';
import { NotificationToggle } from '@/components/features/profile/NotificationToggle/NotificationToggle';
import { AuthGate } from '@/components/ui/AuthGate/AuthGate';
import type { NbaPreferencesDto, UpdateProfileDto } from '@naquadra/types';
import { PersonalizedContent } from '../_sections/PersonalizedContent';
import { getAllTeams } from '@/data/teams';
import { getContrastYIQ } from '@/lib/colors';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user, setUser, clearAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'perfil' | 'nba' | 'notificacoes'>('perfil');

  // Form states initialized with user data (or empty if not loaded yet)
  const [name, setName] = useState(user?.name || '');
  const [avatarBase64, setAvatarBase64] = useState(user?.avatarBase64 || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NBA Prefs
  const [favoriteTeamId, setFavoriteTeamId] = useState<string | null>(user?.favoriteTeamId || null);
  const [followedTeamIds, setFollowedTeamIds] = useState<string[]>(user?.followedTeamIds || []);
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<string[]>(user?.favoritePlayerIds || []);

  // Notification Prefs
  const [notifPrefs, setNotifPrefs] = useState({
    favoriteTeamNews: user?.notificationPreferences?.favoriteTeamNews ?? true,
    injuries: user?.notificationPreferences?.injuries ?? true,
    trades: user?.notificationPreferences?.trades ?? true,
    signings: user?.notificationPreferences?.signings ?? true,
    preGame60min: user?.notificationPreferences?.preGame60min ?? false,
    preGame30min: user?.notificationPreferences?.preGame30min ?? true,
    gameStarted: user?.notificationPreferences?.gameStarted ?? true,
    gameFinal: user?.notificationPreferences?.gameFinal ?? true,
    personalizedNews: user?.notificationPreferences?.personalizedNews ?? true,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast({ type: 'error', title: 'Arquivo muito grande', message: 'A imagem deve ter no máximo 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress using canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setAvatarBase64(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      const payload: UpdateProfileDto = { name, avatarBase64 };
      const res = await authFetch<{ data: any }>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      setUser({ ...user!, ...res.data });
      addToast({ type: 'success', title: 'Perfil atualizado' });
    } catch (error) {
      addToast({ type: 'error', title: 'Erro ao salvar perfil', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNbaPrefs = async () => {
    setIsLoading(true);
    try {
      const payload: NbaPreferencesDto = { favoriteTeamId, followedTeamIds, favoritePlayerIds };
      const res = await authFetch<{ data: any }>('/user-preferences/nba', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      setUser({ ...user!, ...res.data.nba });
      addToast({ type: 'success', title: 'Preferências salvas' });
    } catch (error) {
      addToast({ type: 'error', title: 'Erro ao salvar', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotifPrefs = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch<{ data: any }>('/user-preferences/notifications', {
        method: 'PATCH',
        body: JSON.stringify(notifPrefs)
      });
      setUser({ ...user!, notificationPreferences: res.data.notifications });
      addToast({ type: 'success', title: 'Notificações salvas' });
    } catch (error) {
      addToast({ type: 'error', title: 'Erro ao salvar', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/');
    addToast({ type: 'info', title: 'Você saiu da conta' });
  };

  // Determine team theme colors
  const favoriteTeam = user?.favoriteTeamId ? getAllTeams().find(t => t.id === user.favoriteTeamId) : null;
  const teamPrimaryColor = favoriteTeam?.colors?.primary || '';
  const teamTextColor = teamPrimaryColor ? getContrastYIQ(teamPrimaryColor) : '';
  
  const themeStyles = teamPrimaryColor ? {
    '--nq-brand-primary': teamPrimaryColor,
    '--nq-bg-elevated': teamPrimaryColor,
    '--theme-accent': teamPrimaryColor,
    '--theme-accent-text': teamTextColor === 'white' ? '#ffffff' : '#000000',
  } as React.CSSProperties : {};

  // If not authenticated, render AuthGate logic handled inside page return
  return (
    <AuthGate 
      title="Seu Perfil" 
      description="Faça login para gerenciar suas preferências e personalizar sua experiência na NBA."
    >
      <div className={styles.page} style={themeStyles}>
        <PersonalizedContent />
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
                <div className={styles.avatar}>
                  {avatarBase64 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarBase64} alt="Avatar" />
                  ) : (
                    <span className={styles.avatarFallback}>{name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
                <div className={styles.avatarOverlay}>
                  <Camera size={20} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className={styles.fileInput} 
                accept="image/*" 
                onChange={handleAvatarChange}
              />
              <h2 className={styles.profileName}>{name}</h2>
              <span className={styles.profileRole}>{user?.role === 'admin' ? 'Administrador' : 'Fã de Carteirinha'}</span>
            </div>

            <nav className={styles.nav}>
              <button 
                className={`${styles.navItem} ${activeTab === 'perfil' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('perfil')}
              >
                Dados da Conta
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'nba' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('nba')}
              >
                Meu Universo NBA
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'notificacoes' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('notificacoes')}
              >
                Notificações
              </button>
            </nav>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} /> Sair da conta
            </button>
          </div>

          <div className={styles.content}>
            {activeTab === 'perfil' && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Dados da Conta</h3>
                <div className={styles.field}>
                  <label className={styles.label}>E-mail</label>
                  <input type="email" className={styles.input} value={user?.email || ''} disabled />
                  <span className={styles.helpText}>O e-mail não pode ser alterado.</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Nome de exibição</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveBtn} onClick={saveProfile} disabled={isLoading}>
                    {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <><Save size={18} /> Salvar Perfil</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'nba' && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Meu Universo NBA</h3>
                
                <div className={styles.subSection}>
                  <h4 className={styles.subTitle}>Time do Coração</h4>
                  <p className={styles.helpText}>Defina seu time favorito. A home será personalizada com as cores e o próximo jogo dele.</p>
                  <TeamSelector value={favoriteTeamId || ''} onChange={setFavoriteTeamId} multiple={false} />
                </div>

                <div className={styles.subSection}>
                  <h4 className={styles.subTitle}>Outros Times</h4>
                  <p className={styles.helpText}>Selecione outros times que você acompanha para receber notícias sobre eles.</p>
                  <TeamSelector value={followedTeamIds} onChange={setFollowedTeamIds} multiple={true} />
                </div>

                <div className={styles.subSection}>
                  <h4 className={styles.subTitle}>Jogadores Favoritos</h4>
                  <p className={styles.helpText}>Não importa onde eles joguem, você saberá.</p>
                  <PlayerSearch selectedIds={favoritePlayerIds} onChange={setFavoritePlayerIds} />
                </div>

                <div className={styles.actions}>
                  <button className={styles.saveBtn} onClick={saveNbaPrefs} disabled={isLoading}>
                    {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <><Save size={18} /> Salvar Preferências</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Preferências de Notificação</h3>
                
                <div className={styles.togglesGroup}>
                  <h4 className={styles.groupTitle}>Notícias</h4>
                  <NotificationToggle 
                    label="Notícias do time favorito" 
                    description="Receba um resumo das principais novidades."
                    checked={notifPrefs.favoriteTeamNews} 
                    onChange={v => setNotifPrefs({...notifPrefs, favoriteTeamNews: v})} 
                  />
                  <NotificationToggle 
                    label="Lesões importantes" 
                    description="Alertas sobre lesões de jogadores favoritos ou do seu time."
                    checked={notifPrefs.injuries} 
                    onChange={v => setNotifPrefs({...notifPrefs, injuries: v})} 
                  />
                  <NotificationToggle 
                    label="Trocas e Contratações" 
                    description="Quando o mercado esquenta."
                    checked={notifPrefs.trades} 
                    onChange={v => setNotifPrefs({...notifPrefs, trades: v})} 
                  />
                </div>

                <div className={styles.togglesGroup}>
                  <h4 className={styles.groupTitle}>Jogos do Time Favorito</h4>
                  <NotificationToggle 
                    label="Lembrete 30 min antes" 
                    checked={notifPrefs.preGame30min} 
                    onChange={v => setNotifPrefs({...notifPrefs, preGame30min: v})} 
                  />
                  <NotificationToggle 
                    label="Fim de jogo / Placar final" 
                    checked={notifPrefs.gameFinal} 
                    onChange={v => setNotifPrefs({...notifPrefs, gameFinal: v})} 
                  />
                </div>

                <div className={styles.actions}>
                  <button className={styles.saveBtn} onClick={saveNotifPrefs} disabled={isLoading}>
                    {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <><Save size={18} /> Salvar Notificações</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
