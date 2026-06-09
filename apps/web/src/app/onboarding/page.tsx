'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authFetch } from '@/lib/api-auth';
import { TeamSelector } from '@/components/features/profile/TeamSelector/TeamSelector';
import { PlayerSearch } from '@/components/features/profile/PlayerSearch/PlayerSearch';
import { useToastStore } from '@/lib/stores/toast-store';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import type { NbaPreferencesDto } from '@naquadra/types';
import styles from './page.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [favoriteTeamId, setFavoriteTeamId] = useState<string | null>(null);
  const [followedTeamIds, setFollowedTeamIds] = useState<string[]>([]);
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<string[]>([]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const payload: NbaPreferencesDto = { favoriteTeamId, followedTeamIds, favoritePlayerIds };
      const res = await authFetch<{ data: any }>('/user-preferences/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setUser({ ...user!, ...res.data.nba, onboardingCompleted: true });
      addToast({ type: 'success', title: 'Onboarding concluído!', message: 'Sua experiência agora é personalizada.' });
      router.push('/');
    } catch (error) {
      addToast({ type: 'error', title: 'Erro', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    // Save empty preferences just to mark onboarding as complete
    setIsLoading(true);
    try {
      const payload: NbaPreferencesDto = {};
      const res = await authFetch<{ data: any }>('/user-preferences/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setUser({ ...user!, ...res.data.nba, onboardingCompleted: true });
      router.push('/');
    } catch (error) {
      addToast({ type: 'error', title: 'Erro', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`} />
            <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`} />
            <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`} />
          </div>
          <button className={styles.skipBtn} onClick={skipOnboarding} disabled={isLoading}>
            Pular
          </button>
        </div>

        {step === 1 && (
          <div className={styles.content}>
            <h1 className={styles.title}>Qual é o seu time do coração?</h1>
            <p className={styles.subtitle}>Sua home será personalizada com as cores, escudo e próximo jogo do seu time.</p>
            <div className={styles.selectorWrapper}>
              <TeamSelector value={favoriteTeamId || ''} onChange={setFavoriteTeamId} multiple={false} />
            </div>
            <div className={styles.footer}>
              <div />
              <button 
                className={styles.nextBtn} 
                onClick={handleNext}
                disabled={!favoriteTeamId}
              >
                Continuar <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.content}>
            <h1 className={styles.title}>Quais outros times você acompanha?</h1>
            <p className={styles.subtitle}>Opcional. Selecione outros times para receber notícias relevantes sobre eles.</p>
            <div className={styles.selectorWrapper}>
              <TeamSelector value={followedTeamIds} onChange={setFollowedTeamIds} multiple={true} />
            </div>
            <div className={styles.footer}>
              <button className={styles.prevBtn} onClick={handlePrev}>
                <ChevronLeft size={18} /> Voltar
              </button>
              <button className={styles.nextBtn} onClick={handleNext}>
                Continuar <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.content}>
            <h1 className={styles.title}>E seus jogadores favoritos?</h1>
            <p className={styles.subtitle}>Opcional. Independentemente de onde eles joguem, você será notificado sobre eles.</p>
            <div className={styles.selectorWrapper}>
              <PlayerSearch selectedIds={favoritePlayerIds} onChange={setFavoritePlayerIds} />
            </div>
            <div className={styles.footer}>
              <button className={styles.prevBtn} onClick={handlePrev}>
                <ChevronLeft size={18} /> Voltar
              </button>
              <button className={styles.nextBtn} onClick={handleComplete} disabled={isLoading}>
                {isLoading ? <Loader2 size={18} className={styles.spinner} /> : 'Concluir e Entrar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
