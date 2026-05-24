import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import styles from './EntityCard.module.css';

export interface EntityCardProps {
  /** Target URL for the entire card */
  href: string;
  /** Primary color to be used in the background gradient */
  color?: string;
  /** Image source URL */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Render mode: impacts image sizing and positioning slightly */
  type?: 'player' | 'team';
  /** Main title (e.g. Player Name or Team Name) */
  title: string;
  /** Subtitle (e.g. Position, Team Name for players, or Division for teams) */
  subtitle?: ReactNode;
  /** Additional details row at the bottom (e.g. Height/Weight stats) */
  details?: ReactNode;
}

/**
 * A highly reusable, unified card component for presenting Team and Player entities.
 * The entire card is clickable, fully accessible, and adapts its background color.
 */
export function EntityCard({
  href,
  color = '#5b2c6f', // Default to purple if no color provided
  imageSrc,
  imageAlt = '',
  type = 'player',
  title,
  subtitle,
  details,
}: EntityCardProps) {
  
  // Calculate a slightly darker secondary color for the gradient
  // This uses CSS color-mix to darken the base color by blending with black.
  const styleVars = {
    '--card-color-primary': color,
    '--card-color-secondary': `color-mix(in srgb, ${color} 60%, black)`,
  } as CSSProperties;

  return (
    <Link 
      href={href} 
      className={styles.card} 
      style={styleVars}
      aria-label={`Ver detalhes de ${title}`}
    >
      <div className={styles.imageWrapper}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className={type === 'team' ? styles.imageTeam : styles.imagePlayer} 
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>🏀</div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        
        {details && (
          <div className={styles.details}>
            {details}
          </div>
        )}
      </div>
    </Link>
  );
}
