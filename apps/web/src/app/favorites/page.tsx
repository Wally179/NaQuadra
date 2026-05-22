'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function FavoritesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.authGate}>
        <div className={styles.authGateIcon}>❤️</div>
        <h1 className={styles.authGateTitle}>Seus Favoritos</h1>
        <p className={styles.authGateText}>
          A funcionalidade de favoritos ainda não está disponível. Em breve: salve seus times e jogadores favoritos ao fazer login.
        </p>
        <Link href="/login" className={styles.loginBtn}>Fazer Login</Link>
      </div>
    </div>
  );
}
