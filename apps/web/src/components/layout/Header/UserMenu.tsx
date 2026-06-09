'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import styles from './UserMenu.module.css';

export function UserMenu() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        className={styles.trigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.avatar}>
          {user.avatarBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarBase64} alt={user.name} />
          ) : (
            <span>{user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className={styles.name}>{user.name.split(' ')[0]}</span>
        <ChevronDown size={14} className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.header}>
            <p className={styles.fullName}>{user.name}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
          
          <div className={styles.divider} />
          
          <Link href="/profile" className={styles.item} onClick={() => setIsOpen(false)}>
            <User size={16} />
            <span>Meu Perfil</span>
          </Link>
          
          <Link href="/profile" className={styles.item} onClick={() => setIsOpen(false)}>
            <Settings size={16} />
            <span>Preferências</span>
          </Link>
          
          <div className={styles.divider} />
          
          <button className={`${styles.item} ${styles.logout}`} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sair da conta</span>
          </button>
        </div>
      )}
    </div>
  );
}
