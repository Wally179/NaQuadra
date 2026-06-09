'use client';

import styles from './NotificationToggle.module.css';

interface NotificationToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function NotificationToggle({ label, description, checked, onChange }: NotificationToggleProps) {
  return (
    <div className={styles.container} onClick={() => onChange(!checked)}>
      <div className={styles.textContainer}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.switch} ${checked ? styles.checked : ''}`}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
