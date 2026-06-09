'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo/Logo';
import { useAuthStore } from '@/lib/stores/auth-store';
import { UserMenu } from './UserMenu';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Logo size={26} />
          <span className={styles.logoText}>
            Na<span className={styles.logoAccent}>Quadra</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>Início</Link>
          <Link href="/games" className={`${styles.navLink} ${pathname.startsWith('/games') ? styles.navLinkActive : ''}`}>Jogos</Link>
          <Link href="/standings" className={`${styles.navLink} ${pathname === '/standings' ? styles.navLinkActive : ''}`}>Classificação</Link>
          <Link href="/teams" className={`${styles.navLink} ${pathname === '/teams' ? styles.navLinkActive : ''}`}>Times</Link>
          <Link href="/news" className={`${styles.navLink} ${pathname === '/news' ? styles.navLinkActive : ''}`}>Notícias</Link>
          <Link href="/glossary" className={`${styles.navLink} ${pathname === '/glossary' ? styles.navLinkActive : ''}`}>Glossário</Link>
          <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}>Sobre</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {searchOpen ? (
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar jogador, time ou notícia..."
                className={styles.searchInput}
                autoFocus
                onBlur={() => !query && setSearchOpen(false)}
              />
            </form>
          ) : (
            <button className={styles.iconButton} onClick={() => setSearchOpen(true)} type="button" aria-label="Buscar">
              <Search size={20} />
            </button>
          )}

          {mounted && (
            isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button className={styles.loginButton} type="button">
                  Entrar
                </button>
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
