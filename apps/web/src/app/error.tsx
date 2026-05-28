'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import styles from './error.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <AlertTriangle size={48} className={styles.icon} />
      <h2 className={styles.title}>Algo deu errado na quadra!</h2>
      <p className={styles.description}>
        Tivemos um problema ao carregar esta página. Pode ser uma falha de conexão ou um erro no servidor.
      </p>
      <div className={styles.actions}>
        <button
          onClick={() => reset()}
          className={styles.btnPrimary}
          type="button"
        >
          Tentar novamente
        </button>
        <Link href="/" className={styles.btnSecondary}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
