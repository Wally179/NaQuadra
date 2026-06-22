'use client';

// ============================================================
// Na Quadra — ColdStartBanner
// Appears when loading takes >3s (Render free tier cold start).
// Explains to the user (and recruiters) that this is a portfolio
// project using free-tier infrastructure. Dismissible and
// uses localStorage to avoid showing more than once per session.
// ============================================================

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './ColdStartBanner.module.css';

const STORAGE_KEY = 'nq_cold_start_dismissed';
const APPEAR_DELAY_MS = 3000; // Only show if loading takes >3s
const MAX_ELAPSED_S = 50;     // Expected max cold start time

interface ColdStartBannerProps {
  /** If true, banner will never appear (e.g., API is already warm) */
  disabled?: boolean;
}

export function ColdStartBanner({ disabled = false }: ColdStartBannerProps) {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (disabled) return;

    // Don't show if already dismissed in this session
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (dismissed) return;
    } catch {
      // sessionStorage not available (SSR guard)
      return;
    }

    // Show after APPEAR_DELAY_MS
    timerRef.current = setTimeout(() => {
      setVisible(true);

      // Start elapsed counter
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - start) / 1000);
        setElapsed(elapsedSec);
        // Progress: smoothly approaches 90% over MAX_ELAPSED_S seconds
        // (never reaches 100% while still loading)
        const pct = Math.min(90, (elapsedSec / MAX_ELAPSED_S) * 100);
        setProgress(pct);
      }, 1000);
    }, APPEAR_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [disabled]);

  const handleDismiss = () => {
    setHiding(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    setTimeout(() => {
      setVisible(false);
      setHiding(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 400);
  };

  if (!visible) return null;

  const statusMessages = [
    'Conectando ao servidor...',
    'Inicializando banco de dados...',
    'Carregando dados da ESPN...',
    'Quase lá...',
  ];
  const msgIndex = Math.min(Math.floor(elapsed / 12), statusMessages.length - 1);

  return (
    <div
      className={`${styles.overlay} ${hiding ? styles.hiding : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Informação sobre carregamento"
    >
      <div className={styles.banner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.icon} aria-hidden="true">🏀</span>
            <div className={styles.titleGroup}>
              <span className={styles.title}>Aquecendo os motores</span>
              <span className={styles.subtitle}>Servidor a caminho...</span>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleDismiss}
            aria-label="Fechar aviso"
            title="Fechar"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.message}>
            <span className={styles.highlight}>Na Quadra é um projeto de portfólio</span>{' '}
            desenvolvido com tecnologias{' '}
            <span className={styles.freeTag}>
              ✦ gratuitas
            </span>
            . O servidor pode levar até{' '}
            <span className={styles.highlight}>30–50 segundos</span>{' '}
            para acordar após inatividade — mas após essa primeira conexão, tudo carrega rapidamente! ⚡
          </p>
        </div>

        {/* Progress */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressTrack} aria-hidden="true">
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.progressLabel}>
            <span className={styles.statusText}>
              <span className={styles.dot} aria-hidden="true" />
              {statusMessages[msgIndex]}
            </span>
            <span className={styles.elapsedText}>
              {elapsed}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
