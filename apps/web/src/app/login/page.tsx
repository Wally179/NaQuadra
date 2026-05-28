'use client';

import { useState } from 'react';
import styles from './page.module.css';

type AuthTab = 'login' | 'register';

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('A funcionalidade de autenticação ainda não está disponível. Em breve você poderá criar sua conta e entrar na plataforma.');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏀</span>
          <h1 className={styles.logoTitle}>
            Na<span className={styles.logoAccent}>Quadra</span>
          </h1>
          <p className={styles.logoSubtitle}>
            {tab === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta gratuitamente'}
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => setTab('login')}
            role="tab"
            aria-selected={tab === 'login'}
          >
            Entrar
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => setTab('register')}
            role="tab"
            aria-selected={tab === 'register'}
          >
            Cadastrar
          </button>
        </div>

        {message && (
          <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--nq-bg-elevated)', borderRadius: 'var(--nq-radius-md)', color: 'var(--nq-text-secondary)', fontSize: 'var(--nq-text-sm)', textAlign: 'center', border: '1px solid var(--nq-border-subtle)' }}>
            {message}
          </div>
        )}

        {/* Form */}
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
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="auth-password" className={styles.label}>Senha</label>
            <input
              id="auth-password"
              type="password"
              className={styles.input}
              placeholder={tab === 'login' ? '••••••••' : 'Mínimo 8 caracteres'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={tab === 'register' ? 8 : undefined}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {tab === 'login' ? 'Entrar' : 'Criar conta grátis'}
          </button>
        </form>

        <div className={styles.divider}>ou continue com</div>

        <button type="button" className={styles.socialBtn}>
          <span>G</span> Google
        </button>

        <p className={styles.note}>
          Ao cadastrar, você concorda com nossos{' '}
          <strong>Termos de Uso</strong> e{' '}
          <strong>Política de Privacidade</strong>.
        </p>
      </div>
    </div>
  );
}
