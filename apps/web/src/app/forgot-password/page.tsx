'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToastStore } from '@/lib/stores/toast-store';
import { authFetch } from '@/lib/api-auth';
import { Loader2, ArrowLeft } from 'lucide-react';
import styles from '../login/page.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      
      setIsSuccess(true);
      addToast({ type: 'success', title: 'E-mail enviado', message: 'Verifique sua caixa de entrada para redefinir a senha.' });
    } catch (error) {
      addToast({ type: 'error', title: 'Erro', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏀</span>
          <h1 className={styles.logoTitle}>Recuperar Senha</h1>
          <p className={styles.logoSubtitle}>
            {isSuccess 
              ? 'Verifique seu e-mail' 
              : 'Digite seu e-mail para receber um link de redefinição'}
          </p>
        </div>

        {!isSuccess ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="auth-email" className={styles.label}>E-mail da sua conta</label>
              <input
                id="auth-email"
                type="email"
                className={styles.input}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? <Loader2 size={20} className={styles.spinner} /> : 'Enviar link de recuperação'}
            </button>
          </form>
        ) : (
          <div className={styles.form}>
            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--nq-text-secondary)', marginBottom: '16px' }}>
              Enviamos as instruções de recuperação para <strong>{email}</strong>.
            </p>
            <button type="button" className={styles.submitBtn} onClick={() => router.push('/login')}>
              Voltar para o Login
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/login" className={styles.forgotLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
