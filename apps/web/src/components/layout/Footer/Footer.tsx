import Link from 'next/link';
import { Logo } from '@/components/ui/Logo/Logo';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Logo size={20} className={styles.logo} />
          <span className={styles.brandName}>NaQuadra</span>
        </div>
        <p className={styles.tagline}>
          Entenda a NBA. Acompanhe seus times. Viva a quadra.
        </p>
        <div className={styles.links}>
          <Link href="/about" className={styles.link}>Sobre o Projeto</Link>
          <span className={styles.separator}>•</span>
          <Link href="/glossary" className={styles.link}>Glossário</Link>
          <span className={styles.separator}>•</span>
          <a href="https://github.com/NaQuadra" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
        </div>
      </div>
    </footer>
  );
}
