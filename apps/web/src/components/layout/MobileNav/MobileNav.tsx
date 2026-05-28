'use client';

import { Home, BarChart3, Search, Heart, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileNav.module.css';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav} aria-label="Navegação mobile">
      <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.navItemActive : ''}`}>
        <Home size={22} />
        <span className={styles.navLabel}>Início</span>
      </Link>
      <Link href="/games" className={`${styles.navItem} ${pathname.startsWith('/games') ? styles.navItemActive : ''}`}>
        <Gamepad2 size={22} />
        <span className={styles.navLabel}>Jogos</span>
      </Link>
      <Link href="/standings" className={`${styles.navItem} ${pathname === '/standings' ? styles.navItemActive : ''}`}>
        <BarChart3 size={22} />
        <span className={styles.navLabel}>Classificação</span>
      </Link>
      <Link href="/search" className={`${styles.navItem} ${pathname === '/search' ? styles.navItemActive : ''}`}>
        <Search size={22} />
        <span className={styles.navLabel}>Buscar</span>
      </Link>
      <Link href="/favorites" className={`${styles.navItem} ${pathname === '/favorites' ? styles.navItemActive : ''}`}>
        <Heart size={22} />
        <span className={styles.navLabel}>Favoritos</span>
      </Link>
    </nav>
  );
}
