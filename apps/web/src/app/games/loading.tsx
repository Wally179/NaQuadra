import styles from './page.module.css';

export default function GamesLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="skeleton" style={{ width: 200, height: 36, margin: '0 auto' }} />
          <div className="skeleton" style={{ width: 280, height: 18, margin: '12px auto 0' }} />
        </div>
        <div className={styles.controls}>
          <div className="skeleton" style={{ width: 200, height: 36, margin: '0 auto', borderRadius: '9999px' }} />
        </div>
        <div className={styles.gamesList}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
