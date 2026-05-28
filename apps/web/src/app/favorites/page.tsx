'use client';

import Link from 'next/link';
import { AuthGate } from '@/components/ui/AuthGate/AuthGate';
import { Heart } from 'lucide-react';
import styles from './page.module.css';

export default function FavoritesPage() {
  return (
    <div className={styles.page}>
      <AuthGate 
        title="Seus Favoritos" 
        description="Em breve: salve seus times do coração. Faça login para ser o primeiro!"
        icon={<Heart size={48} color="#ef4444" />}
      />
    </div>
  );
}
