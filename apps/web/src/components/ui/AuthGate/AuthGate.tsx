'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useEffect, useState } from 'react';
import styles from './AuthGate.module.css';

interface AuthGateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function AuthGate({ title, description, icon, children }: AuthGateProps) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isAuthenticated && children) {
    return <>{children}</>;
  }

  return (
    <div className={styles.authGate}>
      <div className={styles.authGateIcon}>{icon || <Lock size={48} />}</div>
      <h1 className={styles.authGateTitle}>{title}</h1>
      <p className={styles.authGateText}>{description}</p>
      <Link href={`/login?returnUrl=${encodeURIComponent(pathname)}`} className={styles.loginBtn}>
        Fazer Login
      </Link>
    </div>
  );
}
