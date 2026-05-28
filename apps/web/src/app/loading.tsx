import styles from './loading.module.css';

export default function GlobalLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.text}>Aquecendo...</p>
    </div>
  );
}
