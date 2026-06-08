// ============================================================
// Na Quadra — Skeleton Components
// Reusable loading placeholders for progressive rendering.
// ============================================================

import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: CSSProperties;
}

/** Base skeleton block with shimmer animation */
export function Skeleton({ width, height, borderRadius, className, style }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className || ''}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  /** Width of the last line (e.g. '60%') */
  lastLineWidth?: string;
  lineHeight?: string | number;
  gap?: string | number;
  className?: string;
}

/** Multiple skeleton text lines with natural-looking variation */
export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = '14px',
  gap = 'var(--nq-space-2)',
  className,
}: SkeletonTextProps) {
  return (
    <div
      className={`${styles.container} ${className || ''}`}
      style={{ display: 'flex', flexDirection: 'column', gap }}
      aria-hidden="true"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${styles.text}`}
          style={{
            height: lineHeight,
            width: i === lines - 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  );
}

interface SkeletonCircleProps {
  size?: string | number;
  className?: string;
}

/** Circular skeleton for avatars/headshots */
export function SkeletonCircle({ size = 48, className }: SkeletonCircleProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles.circle} ${className || ''}`}
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}
