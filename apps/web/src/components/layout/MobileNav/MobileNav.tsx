'use client';

import { Home, BarChart3, Search, Heart, User } from 'lucide-react';
import Link from 'next/link';
import styles from './MobileNav.module.css';

export function MobileNav() {
  return (
    <nav className={styles.mobileNav} aria-label="Navegação mobile">
      <Link href="/" className={styles.navItem}>
        <Home size={22} />
        <span className={styles.navLabel}>Início</span>
      </Link>
      <Link href="/standings" className={styles.navItem}>
        <BarChart3 size={22} />
        <span className={styles.navLabel}>Standings</span>
      </Link>
      <Link href="/search" className={styles.navItem}>
        <Search size={22} />
        <span className={styles.navLabel}>Buscar</span>
      </Link>
      <Link href="/favorites" className={styles.navItem}>
        <Heart size={22} />
        <span className={styles.navLabel}>Favoritos</span>
      </Link>
      <Link href="/profile" className={styles.navItem}>
        <User size={22} />
        <span className={styles.navLabel}>Perfil</span>
      </Link>
    </nav>
  );
}
