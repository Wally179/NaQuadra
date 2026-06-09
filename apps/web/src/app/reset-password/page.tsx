'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToastStore } from '@/lib/stores/toast-store';
import { authFetch } from '@/lib/api-auth';
import { Loader2 } from 'lucide-react';
import styles from '../login/page.module.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const { addToast } = useToastStore();

  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      addToast({ type: 'error', title: 'Token inválido', message: 'O link de recuperação parece estar quebrado.' });
      return;
    }

    if (password !== confirmPassword) {
      addToast({ type: 'error', title: 'Erro de validação', message: 'As senhas não coincidem.' });
      return;
    }

    setIsLoading(true);

    try {
      await authFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, email, newPassword: password })
      });
      
      addToast({ type: 'success', title: 'Senha redefinida', message: 'Você já pode fazer login com sua nova senha.' });
      router.push('/login');
    } catch (error) {
      addToast({ type: 'error', title: 'Erro ao redefinir', message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.form}>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--nq-text-secondary)', marginBottom: '16px' }}>
          Link inválido. Solicite uma nova recuperação de senha.
        </p>
        <Link href="/forgot-password" className={styles.submitBtn} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="auth-email" className={styles.label}>E-mail da sua conta</label>
        <input
          id="auth-email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="auth-password" className={styles.label}>Nova Senha</label>
        <input
          id="auth-password"
          type="password"
          className={styles.input}
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="auth-confirm" className={styles.label}>Confirmar Nova Senha</label>
        <input
          id="auth-confirm"
          type="password"
          className={styles.input}
          placeholder="Mínimo 8 caracteres"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          disabled={isLoading}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? <Loader2 size={20} className={styles.spinner} /> : 'Salvar nova senha'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏀</span>
          <h1 className={styles.logoTitle}>Nova Senha</h1>
          <p className={styles.logoSubtitle}>
            Crie uma nova senha segura para sua conta
          </p>
        </div>

        <Suspense fallback={<div className={styles.form}><p style={{ textAlign: 'center' }}>Carregando...</p></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
