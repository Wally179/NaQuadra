'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: 'var(--nq-space-8)',
      textAlign: 'center',
      fontFamily: 'var(--nq-font-body)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--nq-space-4)' }}>⚠️</div>
      <h2 style={{
        fontFamily: 'var(--nq-font-display)',
        fontSize: 'var(--nq-text-2xl)',
        color: 'var(--nq-text-primary)',
        marginBottom: 'var(--nq-space-2)'
      }}>Algo deu errado na quadra!</h2>
      <p style={{
        color: 'var(--nq-text-secondary)',
        marginBottom: 'var(--nq-space-6)',
        maxWidth: '400px'
      }}>
        Tivemos um problema ao carregar esta página. Pode ser uma falha de conexão ou um erro no servidor.
      </p>
      <div style={{ display: 'flex', gap: 'var(--nq-space-4)' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: 'var(--nq-space-3) var(--nq-space-6)',
            backgroundColor: 'var(--nq-system-info)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--nq-radius-md)',
            fontWeight: 'var(--nq-font-bold)',
            cursor: 'pointer'
          }}
        >
          Tentar novamente
        </button>
        <Link href="/" style={{
          padding: 'var(--nq-space-3) var(--nq-space-6)',
          backgroundColor: 'var(--nq-bg-elevated)',
          color: 'var(--nq-text-primary)',
          textDecoration: 'none',
          border: '1px solid var(--nq-border-default)',
          borderRadius: 'var(--nq-radius-md)',
          fontWeight: 'var(--nq-font-medium)'
        }}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
