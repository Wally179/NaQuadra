'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { authFetch, ApiError } from '@/lib/api-auth';
import { Loader2 } from 'lucide-react';
import styles from './page.module.css';
import type { RegisterRequest, LoginRequest, AuthTokens } from '@naquadra/types';

type AuthTab = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const { setTokens, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [tab, setTab] = useState<AuthTab>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Redireciona se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  const validateForm = () => {
    if (tab === 'register' && password !== confirmPassword) {
      addToast({ type: 'error', title: 'Erro de validação', message: 'As senhas não coincidem.' });
      return false;
    }
    if (password.length < 8) {
      addToast({ type: 'error', title: 'Senha fraca', message: 'A senha deve ter no mínimo 8 caracteres.' });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      const payload: LoginRequest = { email, password };
      const res = await authFetch<{ data: AuthTokens }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setTokens(res.data.accessToken, res.data.refreshToken);
      addToast({ type: 'success', title: 'Login realizado com sucesso!' });
      
      router.push(returnUrl);
    } catch (error) {
      addToast({ type: 'error', title: 'Falha no login', message: (error as Error).message });
    }
  };

  const handleRegister = async () => {
    try {
      const payload: RegisterRequest = { name, email, password, confirmPassword };
      const res = await authFetch<{ data: AuthTokens }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      setTokens(res.data.accessToken, res.data.refreshToken);
      addToast({ type: 'success', title: 'Conta criada com sucesso!' });
      
      // Redirecionar para onboarding (a página pode pular)
      router.push('/onboarding');
    } catch (error) {
      addToast({ type: 'error', title: 'Erro ao criar conta', message: (error as Error).message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    if (tab === 'login') {
      await handleLogin();
    } else {
      await handleRegister();
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏀</span>
          <h1 className={styles.logoTitle}>
            Na<span className={styles.logoAccent}>Quadra</span>
          </h1>
          <p className={styles.logoSubtitle}>
            {tab === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta gratuitamente'}
          </p>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => setTab('login')}
            role="tab"
            aria-selected={tab === 'login'}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => setTab('register')}
            role="tab"
            aria-selected={tab === 'register'}
          >
            Cadastrar
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className={styles.field}>
              <label htmlFor="auth-name" className={styles.label}>Nome</label>
              <input
                id="auth-name"
                type="text"
                className={styles.input}
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="auth-email" className={styles.label}>E-mail</label>
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

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="auth-password" className={styles.label}>Senha</label>
              {tab === 'login' && (
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Esqueci a senha
                </Link>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              className={styles.input}
              placeholder={tab === 'login' ? '••••••••' : 'Mínimo 8 caracteres'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          {tab === 'register' && (
            <div className={styles.field}>
              <label htmlFor="auth-confirm" className={styles.label}>Confirmar Senha</label>
              <input
                id="auth-confirm"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? <Loader2 size={20} className={styles.spinner} /> : (tab === 'login' ? 'Entrar' : 'Criar conta grátis')}
          </button>
        </form>
      </div>
    </div>
  );
}
