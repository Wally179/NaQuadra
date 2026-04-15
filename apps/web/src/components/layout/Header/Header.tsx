'use client';

import { Search, User } from 'lucide-react';
import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
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
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.iconButton} type="button" aria-label="Buscar">
            <Search size={20} />
          </button>
          <button className={styles.iconButton} type="button" aria-label="Perfil">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
