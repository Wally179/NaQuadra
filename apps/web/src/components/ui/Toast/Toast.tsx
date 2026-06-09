'use client';

import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { Toast as ToastType } from '@/lib/stores/toast-store';
import styles from './Toast.module.css';
import { useEffect, useState } from 'react';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle2 size={20} className={styles.iconSuccess} />,
  error: <AlertCircle size={20} className={styles.iconError} />,
  info: <Info size={20} className={styles.iconInfo} />,
  warning: <AlertTriangle size={20} className={styles.iconWarning} />,
};

export function Toast({ toast, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 3700); // Start closing animation 300ms before store removes it
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.toast} ${styles[toast.type]} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.iconWrapper}>
        {icons[toast.type]}
      </div>
      <div className={styles.content}>
        <strong className={styles.title}>{toast.title}</strong>
        {toast.message && <p className={styles.message}>{toast.message}</p>}
      </div>
      <button onClick={handleClose} className={styles.closeBtn} aria-label="Fechar">
        <X size={16} />
      </button>
    </div>
  );
}
