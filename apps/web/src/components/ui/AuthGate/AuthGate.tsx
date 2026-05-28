'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import styles from './AuthGate.module.css';

interface AuthGateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function AuthGate({ title, description, icon }: AuthGateProps) {
  return (
    <div className={styles.authGate}>
      <div className={styles.authGateIcon}>{icon || <Lock size={48} />}</div>
      <h1 className={styles.authGateTitle}>{title}</h1>
      <p className={styles.authGateText}>{description}</p>
      <Link href="/login" className={styles.loginBtn}>
        Fazer Login
      </Link>
    </div>
  );
}
