'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>🏀</div>
        <div>
          <h1 className={styles.profileName}>Demo User</h1>
          <p className={styles.profileEmail}>demo@naquadra.com.br</p>
          <span className={styles.profileBadge}>⭐ Fã de basquete</span>
        </div>
      </div>

      {/* Activity Stats */}
      <div className={styles.statsRow}>
        {[
          { value: '3', label: 'Times fav.' },
          { value: '12', label: 'Artigos lidos' },
          { value: '26', label: 'Termos vistos' },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionAccent} aria-hidden="true" />
          Configurações
        </h2>
      </div>

      <div className={styles.settingsList}>
        {[
          { label: 'Notificações de jogos', value: 'Ativadas' },
          { label: 'Fuso horário', value: 'BRT (UTC-3)' },
          { label: 'Idioma', value: 'Português (BR)' },
          { label: 'Newsletter', value: 'Semanal' },
        ].map((s) => (
          <button key={s.label} className={styles.settingItem} type="button">
            <span className={styles.settingLabel}>{s.label}</span>
            <span className={styles.settingValue}>{s.value} →</span>
          </button>
        ))}
      </div>

      <button type="button" className={styles.logoutBtn}>
        Sair da conta
      </button>
    </div>
  );
}
