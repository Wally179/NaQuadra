'use client';

import { Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

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
          <span className={styles.logoIcon}>🏀</span>
          <span className={styles.logoText}>
            Na<span className={styles.logoAccent}>Quadra</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link href="/" className={styles.navLink}>Início</Link>
          <Link href="/standings" className={styles.navLink}>Standings</Link>
          <Link href="/teams" className={styles.navLink}>Times</Link>
          <Link href="/news" className={styles.navLink}>Notícias</Link>
          <Link href="/glossary" className={styles.navLink}>Glossário</Link>
          <Link href="/about" className={styles.navLink}>Sobre</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {searchOpen ? (
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar (ex: LeBron)..."
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

          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className={styles.loginButton} type="button">
              Entrar
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
